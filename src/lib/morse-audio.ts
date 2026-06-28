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
let audioModeReady = false;

async function ensureAudioMode(): Promise<void> {
  if (audioModeReady) return;
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
  });
  audioModeReady = true;
}

function writeStr(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function generateWavBytes(opts: {
  frequencyHz: number;
  durationMs: number;
  volume: number;
  waveform: "sine" | "square";
}): Uint8Array {
  const { frequencyHz, durationMs, volume, waveform } = opts;
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
  view.setUint16(20, 1, true);   // PCM
  view.setUint16(22, 1, true);   // mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const maxAmplitude = 32767 * volume;
  const phaseInc = (2 * Math.PI * frequencyHz) / SAMPLE_RATE;

  for (let i = 0; i < numSamples; i++) {
    let envelope = 1;
    if (i < attackSamples) {
      envelope = i / attackSamples;
    } else if (i > numSamples - releaseSamples) {
      envelope = (numSamples - i) / releaseSamples;
    }

    const wave =
      waveform === "square"
        ? Math.sin(i * phaseInc) >= 0 ? 1 : -1
        : Math.sin(i * phaseInc);

    view.setInt16(headerSize + i * 2, Math.round(wave * envelope * maxAmplitude), true);
  }

  return new Uint8Array(buf);
}

const uriCache = new Map<string, string>();

function getOrCreateToneUri(opts: {
  frequencyHz: number;
  durationMs: number;
  volume: number;
  waveform: "sine" | "square";
}): string {
  const key = `${opts.frequencyHz}_${opts.durationMs}_${Math.round(opts.volume * 100)}_${opts.waveform}`;
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

async function playTone(opts: {
  frequencyHz: number;
  durationMs: number;
  volume: number;
  waveform: "sine" | "square";
}): Promise<void> {
  await ensureAudioMode();
  const uri = getOrCreateToneUri(opts);
  const player = createAudioPlayer(uri);
  player.play();
  const sub = player.addListener("playbackStatusUpdate", (status) => {
    if (status.didJustFinish) {
      sub.remove();
      player.remove();
    }
  });
}

export async function resumeMorseAudio(): Promise<void> {
  await ensureAudioMode();
}

export async function playDotSound(
  audio: MorseAudioSettings = DEFAULT_MORSE_AUDIO_SETTINGS,
): Promise<void> {
  if (!audio.enabled) return;
  await playTone({
    frequencyHz: audio.frequencyHz,
    durationMs: AUDIO_UNIT_MS,
    volume: audio.volume,
    waveform: audio.waveform,
  });
}

export async function playDashSound(
  audio: MorseAudioSettings = DEFAULT_MORSE_AUDIO_SETTINGS,
): Promise<void> {
  if (!audio.enabled) return;
  await playTone({
    frequencyHz: audio.frequencyHz,
    durationMs: AUDIO_UNIT_MS * AUDIO_DASH_RATIO,
    volume: audio.volume,
    waveform: audio.waveform,
  });
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
