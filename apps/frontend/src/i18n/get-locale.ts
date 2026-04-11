import { DEFAULT_LOCALE, SUPPORTED_LOCALES, SupportedLocale } from "./config";

export function resolveLocale(input?: string): SupportedLocale {
  if (!input) return DEFAULT_LOCALE;

  return SUPPORTED_LOCALES.includes(input as SupportedLocale)
    ? (input as SupportedLocale)
    : DEFAULT_LOCALE;
}
