export type MorseAudioSettings = {
  frequencyHz: number;
};

export const AUDIO_UNIT_MS = 80;
export const AUDIO_DASH_RATIO = 3;
export const AUDIO_ATTACK_MS = 2;
export const AUDIO_RELEASE_MS = 8;
export const AUDIO_FILTER_HZ = 1200;

export const AUDIO_SETTINGS_STORAGE_KEY = "morse-tree-audio-settings";

export const DEFAULT_MORSE_AUDIO_SETTINGS: MorseAudioSettings = {
  frequencyHz: 600,
};

export function normalizeMorseAudioSettings(
  partial: Partial<MorseAudioSettings>,
): MorseAudioSettings {
  const base = { ...DEFAULT_MORSE_AUDIO_SETTINGS, ...partial };
  return {
    frequencyHz: clamp(Math.round(base.frequencyHz), 200, 1500),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function parseStoredAudioSettings(raw: string): MorseAudioSettings | null {
  try {
    const parsed = JSON.parse(raw) as Partial<MorseAudioSettings>;
    if (typeof parsed.frequencyHz !== "number") return null;
    return normalizeMorseAudioSettings(parsed);
  } catch {
    return null;
  }
}
