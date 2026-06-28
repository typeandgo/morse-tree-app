export const WPM_MIN = 1;
export const WPM_MAX = 40;
export const WPM_DEFAULT = 5;
export const WPM_STEP = 1;

export type MorseSettings = {
  wpm: number;
};

export const DEFAULT_MORSE_SETTINGS: MorseSettings = {
  wpm: WPM_DEFAULT,
};

export const SETTINGS_STORAGE_KEY = "morse-tree-settings";

export function getUnitMs(settings: MorseSettings): number {
  return Math.round(1200 / settings.wpm);
}

export function getDotMax(settings: MorseSettings): number {
  return Math.round(getUnitMs(settings) * 2);
}

export function getDashMin(settings: MorseSettings): number {
  return getDotMax(settings) + 1;
}

export function getDashMax(settings: MorseSettings): number {
  return Math.round(getUnitMs(settings) * 6);
}

export function getDurationBetweenQueue(settings: MorseSettings): number {
  return Math.round(getUnitMs(settings) * 7);
}

export function getDurationEndOfQueue(settings: MorseSettings): number {
  return Math.round(getUnitMs(settings) * 5);
}

export function getPathStepMs(settings: MorseSettings): number {
  return Math.max(20, Math.round(getUnitMs(settings) / 2));
}

export function normalizeMorseSettings(
  partial: Partial<MorseSettings>,
): MorseSettings {
  const base = { ...DEFAULT_MORSE_SETTINGS, ...partial };
  return {
    wpm: clamp(Math.round(base.wpm), WPM_MIN, WPM_MAX),
  };
}

export function parseStoredSettings(raw: string): MorseSettings | null {
  try {
    const parsed = JSON.parse(raw) as Partial<MorseSettings>;
    if (typeof parsed.wpm !== "number") return null;
    return normalizeMorseSettings(parsed);
  } catch {
    return null;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
