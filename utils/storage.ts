export const STORAGE_KEYS = {
  preferences: 'travelmate.preferences',
  rates: 'travelmate.rates',
  translations: 'travelmate.translations',
} as const;

export const CACHE_STORAGE_KEYS = [STORAGE_KEYS.rates, STORAGE_KEYS.translations] as const;
