export type SupportedLocale = "ua" | "en" | "pl";

export const oblastPlaceholder: Record<SupportedLocale, string> = {
  ua: "Область",
  en: "Region",
  pl: "Obwód",
};

export const cityPlaceholder: Record<SupportedLocale, string> = {
  ua: "Місто",
  en: "City",
  pl: "Miasto",
};

export const warehousePlaceholder: Record<SupportedLocale, string> = {
  ua: "Склад",
  en: "Warehouse",
  pl: "Magazyn",
};

export const loadingMessage: Record<SupportedLocale, string> = {
  ua: "Завантаження...",
  en: "Loading...",
  pl: "Ładowanie...",
};

export const noOptionsMessage: Record<SupportedLocale, string> = {
  ua: "Нічого не знайдено",
  en: "Nothing found",
  pl: "Nic nie znaleziono",
};

export const noOptionsWithMinLength: Record<SupportedLocale, { tooShort: string; notFound: string }> = {
    ua: { tooShort: "Введіть мінімум 2 літери", notFound: "Нічого не знайдено" },
    en: { tooShort: "Enter at least 2 letters", notFound: "Nothing found" },
    pl: { tooShort: "Wpisz co najmniej 2 litery", notFound: "Nic nie znaleziono" },
};

export function getLocalizedText<T extends Record<SupportedLocale, string>>(
  translations: T,
  locale: string
): string {
  const supportedLocales: SupportedLocale[] = ["ua", "en", "pl"];
  if (supportedLocales.includes(locale as SupportedLocale)) {
    return translations[locale as SupportedLocale];
  }
  return translations.ua;
}

export function getMinLengthMessage(
    locale: string,
    inputLength: number,
    minLength: number
  ): string {
    const supportedLocales: SupportedLocale[] = ["ua", "en", "pl"];
    const messages = supportedLocales.includes(locale as SupportedLocale)
      ? noOptionsWithMinLength[locale as SupportedLocale]
      : noOptionsWithMinLength.ua;
  
    return inputLength < minLength ? messages.tooShort : messages.notFound;
  }