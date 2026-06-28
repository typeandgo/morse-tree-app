import { en } from "./messages/en";
import { tr } from "./messages/tr";
import type { Messages } from "./messages/types";

export type { Messages } from "./messages/types";

export type Locale = "tr" | "en";

export const LOCALES: Locale[] = ["tr", "en"];

export const LOCALE_STORAGE_KEY = "morse-tree-locale";

export const DEFAULT_LOCALE: Locale = "tr";

const catalogs: Record<Locale, Messages> = { tr, en };

type Params = Record<string, string | number>;

function getNestedValue(obj: Messages, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object" || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export function translate(
  locale: Locale,
  key: string,
  params?: Params,
): string {
  const template = getNestedValue(catalogs[locale], key);
  if (!template) return key;
  return interpolate(template, params);
}

export function getLocaleLabel(locale: Locale): string {
  return locale === "tr" ? "Türkçe" : "English";
}
