import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { File, Paths } from "expo-file-system";
import { CODE_TYPES, type CodeType } from "@/constants/main.constants";
import {
  AUDIO_UNIT_MS,
  AUDIO_DASH_RATIO,
  AUDIO_ATTACK_MS,
  AUDIO_RELEASE_MS,
  DEFAULT_MORSE_AUDIO_SETTINGS,
  type MorseAudioSettings,
} from "@/lib/morse-audio-settings";

const SAMPLE_RATE = 44100;
const AUDIO_VOLUME = 1.0;
// Long enough to cover any press at minimum WPM (WPM=1 → dash ≈ 3600ms)
const PRESS_TONE_DURATION_MS = 5000;

// Promise-lock: all concurrent callers await the same in-flight init,
// preventing duplicate setAudioModeAsync calls that can silently drop
// playback on iOS when two calls race at startup.
let audioModePromise: Promise<void> | null = null;

async function ensureAudioMode(): Promise<void> {
  if (!audioModePromise) {
    audioModePromise = setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    }).catch((err: unknown) => {
      // Reset so the next caller can retry.
      audioModePromise = null;
      throw err;
    });
  }
  await audioModePromise;
}

function writeStr(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function generateWavBytes(opts: {
  frequencyHz: number;
  durationMs: number;
}): Uint8Array {
  const { frequencyHz, durationMs } = opts;
  const numSamples = Math.ceil((SAMPLE_RATE * durationMs) / 1000);
  const attackSamples = Math.ceil((SAMPLE_RATE * AUDIO_ATTACK_MS) / 1000);
  const releaseSamples = Math.ceil((SAMPLE_RATE * AUDIO_RELEASE_MS) / 1000);
  const dataSize = numSamples * 2;
  const headerSize = 44;
  const buf = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(buf);

  writeStr(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(view, 8, "WAVE");
  writeStr(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const maxAmplitude = 32767 * AUDIO_VOLUME;
  const phaseInc = (2 * Math.PI * frequencyHz) / SAMPLE_RATE;

  for (let i = 0; i < numSamples; i++) {
    let envelope = 1;
    if (i < attackSamples) {
      envelope = i / attackSamples;
    } else if (i > numSamples - releaseSamples) {
      envelope = (numSamples - i) / releaseSamples;
    }
    const wave = Math.sin(i * phaseInc);
    view.setInt16(headerSize + i * 2, Math.round(wave * envelope * maxAmplitude), true);
  }

  return new Uint8Array(buf);
}

// URI cache: ensures each (frequencyHz, durationMs) pair is only written to disk once.
const uriCache = new Map<string, string>();

const AUDIO_VOLUME_TAG = Math.round(AUDIO_VOLUME * 100);

function getOrCreateToneUri(opts: {
  frequencyHz: number;
  durationMs: number;
}): string {
  const key = `${opts.frequencyHz}_${opts.durationMs}_v${AUDIO_VOLUME_TAG}`;
  const cached = uriCache.get(key);
  if (cached) return cached;

  const file = new File(Paths.cache, `morse_tone_${key}.wav`);
  if (!file.exists) {
    const bytes = generateWavBytes(opts);
    file.write(bytes);
  }

  uriCache.set(key, file.uri);
  return file.uri;
}

// Persistent player kept alive across presses — no init latency on each press.
let pressTonePlayer: ReturnType<typeof createAudioPlayer> | null = null;
let pressToneStopTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Call at app startup and whenever audioSettings change.
 * Warms up the audio session, pre-generates WAV files, and pre-creates
 * the press tone player so the first press has zero init latency.
 */
export async function prepareAudio(audio: MorseAudioSettings): Promise<void> {
  await ensureAudioMode();
  getOrCreateToneUri({ frequencyHz: audio.frequencyHz, durationMs: AUDIO_UNIT_MS });
  getOrCreateToneUri({ frequencyHz: audio.frequencyHz, durationMs: AUDIO_UNIT_MS * AUDIO_DASH_RATIO });

  // Recreate press player whenever audio settings change (e.g. frequency)
  if (pressTonePlayer) {
    pressTonePlayer.remove();
    pressTonePlayer = null;
  }
  const pressUri = getOrCreateToneUri({ frequencyHz: audio.frequencyHz, durationMs: PRESS_TONE_DURATION_MS });
  pressTonePlayer = createAudioPlayer(pressUri);
}

function cancelPendingStop(): void {
  if (pressToneStopTimer) {
    clearTimeout(pressToneStopTimer);
    pressToneStopTimer = null;
  }
}

function doStopPressTone(): void {
  if (!pressTonePlayer) return;
  pressTonePlayer.pause();
  pressTonePlayer.seekTo(0);
}

export function startPressTone(
  audio: MorseAudioSettings = DEFAULT_MORSE_AUDIO_SETTINGS,
): void {
  cancelPendingStop();
  if (!pressTonePlayer) {
    // Fallback if prepareAudio hasn't completed yet
    const uri = getOrCreateToneUri({ frequencyHz: audio.frequencyHz, durationMs: PRESS_TONE_DURATION_MS });
    pressTonePlayer = createAudioPlayer(uri);
  }
  pressTonePlayer.seekTo(0);
  pressTonePlayer.play();
}

export function stopPressTone(delayMs = 0): void {
  cancelPendingStop();
  if (delayMs <= 0) {
    doStopPressTone();
    return;
  }
  pressToneStopTimer = setTimeout(() => {
    pressToneStopTimer = null;
    doStopPressTone();
  }, delayMs);
}

async function playTone(opts: {
  frequencyHz: number;
  durationMs: number;
}): Promise<void> {
  try {
    await ensureAudioMode();
    const uri = getOrCreateToneUri(opts);
    const player = createAudioPlayer(uri);

    // Guard: if didJustFinish never fires (playback error or interruption),
    // clean up after a deadline so players don't accumulate.
    const guardMs = opts.durationMs + 1500;
    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      clearTimeout(guard);
      sub.remove();
      player.remove();
    };
    const guard = setTimeout(cleanup, guardMs);

    // Register listener before play() to avoid missing didJustFinish on
    // very short tones where completion could race listener registration.
    const sub = player.addListener("playbackStatusUpdate", (status) => {
      if (status.didJustFinish) cleanup();
    });

    player.play();
  } catch {
    // Audio is non-critical; swallow to avoid unhandled rejection noise.
  }
}

export async function playDotSound(
  audio: MorseAudioSettings = DEFAULT_MORSE_AUDIO_SETTINGS,
): Promise<void> {
  await playTone({ frequencyHz: audio.frequencyHz, durationMs: AUDIO_UNIT_MS });
}

export async function playDashSound(
  audio: MorseAudioSettings = DEFAULT_MORSE_AUDIO_SETTINGS,
): Promise<void> {
  await playTone({ frequencyHz: audio.frequencyHz, durationMs: AUDIO_UNIT_MS * AUDIO_DASH_RATIO });
}

export async function playMorseSymbolSound(
  symbol: CodeType,
  audio: MorseAudioSettings = DEFAULT_MORSE_AUDIO_SETTINGS,
): Promise<void> {
  if (symbol === CODE_TYPES.DOT) {
    await playDotSound(audio);
  } else {
    await playDashSound(audio);
  }
}
