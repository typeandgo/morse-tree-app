import { CODE_TYPES, type CodeType } from "@/constants/main.constants";
import { getDotMax, getDashMax, type MorseSettings } from "@/lib/morse-settings";

export function pressDurationToSymbol(
  durationMs: number,
  settings: MorseSettings,
): CodeType {
  const dotMax = getDotMax(settings);
  const dashMax = getDashMax(settings);
  const clamped = Math.min(durationMs, dashMax);
  return clamped <= dotMax ? CODE_TYPES.DOT : CODE_TYPES.DASH;
}

export function symbolToChar(symbol: CodeType): "." | "-" {
  return symbol === CODE_TYPES.DOT ? "." : "-";
}
