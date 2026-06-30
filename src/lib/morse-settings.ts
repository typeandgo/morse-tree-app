export const WPM_MIN = 1;
export const WPM_MAX = 25;
export const WPM_DEFAULT = 10;
export const WPM_STEP = 1;

export const GAP_MULTIPLIER_MIN = 1;
export const GAP_MULTIPLIER_MAX = 2;
export const GAP_MULTIPLIER_DEFAULT = 1;
export const GAP_MULTIPLIER_STEP = 0.1;

export type MorseSettings = {
  wpm: number;
  gapMultiplier: number;
};

export const DEFAULT_MORSE_SETTINGS: MorseSettings = {
  wpm: WPM_DEFAULT,
  gapMultiplier: GAP_MULTIPLIER_DEFAULT,
};

export const SETTINGS_STORAGE_KEY = "morse-tree-settings";

export function getUnitMs(settings: MorseSettings): number {
  return Math.round(1200 / settings.wpm) * 2;
}

export function getDotMax(settings: MorseSettings): number {
  return getUnitMs(settings);
}

export function getDashMin(settings: MorseSettings): number {
  return getDotMax(settings) + 1;
}

export function getDashMax(settings: MorseSettings): number {
  return getDotMax(settings) * 3 + 1;
}

export function getDurationBetweenQueue(settings: MorseSettings): number {
  return Math.round(getUnitMs(settings) * 7 * settings.gapMultiplier);
}

export function getDurationEndOfQueue(): number {
  return 500;
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
    gapMultiplier: Math.round(clamp(base.gapMultiplier, GAP_MULTIPLIER_MIN, GAP_MULTIPLIER_MAX) * 10) / 10,
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
