export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'SRD';

export type LanguageCode = 'en' | 'es' | 'fr' | 'nl' | 'pt' | 'de' | 'ja';

export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  symbol: string;
}

export interface LanguageOption {
  code: LanguageCode;
  label: string;
}

export interface UserPreferences {
  homeCurrency: CurrencyCode;
  preferredLanguage: LanguageCode;
  onboardingCompleted: boolean;
}

export interface CountryProfile {
  countryCode: string;
  countryName: string;
  currency: CurrencyCode;
  language: LanguageCode;
}

export interface LocationResolution {
  profile: CountryProfile;
  permissionGranted: boolean;
  usedFallback: boolean;
}

export interface ExchangeRateCache {
  baseCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  rate: number;
  updatedAt: string;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  provider: 'mock' | 'api';
}
