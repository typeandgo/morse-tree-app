export type MorseWaveform = "square" | "sine";

export type MorseAudioSettings = {
  enabled: boolean;
  volume: number;
  frequencyHz: number;
  waveform: MorseWaveform;
};

export const AUDIO_UNIT_MS = 80;
export const AUDIO_DASH_RATIO = 3;
export const AUDIO_ATTACK_MS = 2;
export const AUDIO_RELEASE_MS = 8;
export const AUDIO_FILTER_HZ = 1200;

export const AUDIO_SETTINGS_STORAGE_KEY = "morse-tree-audio-settings";

export const DEFAULT_MORSE_AUDIO_SETTINGS: MorseAudioSettings = {
  enabled: true,
  volume: 0.22,
  frequencyHz: 600,
  waveform: "sine",
};

export function normalizeMorseAudioSettings(
  partial: Partial<MorseAudioSettings>,
): MorseAudioSettings {
  const base = { ...DEFAULT_MORSE_AUDIO_SETTINGS, ...partial };
  return {
    enabled: base.enabled ?? true,
    volume: clamp(Math.round(base.volume * 100) / 100, 0.05, 0.5),
    frequencyHz: clamp(Math.round(base.frequencyHz), 200, 1500),
    waveform: base.waveform === "square" ? "square" : "sine",
  };
}

export function parseStoredAudioSettings(raw: string): MorseAudioSettings | null {
  try {
    const parsed = JSON.parse(raw) as Partial<MorseAudioSettings>;
    return normalizeMorseAudioSettings(parsed);
  } catch {
    return null;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
