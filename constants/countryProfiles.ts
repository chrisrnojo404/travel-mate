import { CountryProfile } from '@/types';

export const fallbackCountryProfile: CountryProfile = {
  countryCode: 'US',
  countryName: 'United States',
  currency: 'USD',
  language: 'en',
};

export const countryProfiles: Record<string, CountryProfile> = {
  US: fallbackCountryProfile,
  FR: { countryCode: 'FR', countryName: 'France', currency: 'EUR', language: 'fr' },
  ES: { countryCode: 'ES', countryName: 'Spain', currency: 'EUR', language: 'es' },
  DE: { countryCode: 'DE', countryName: 'Germany', currency: 'EUR', language: 'de' },
  NL: { countryCode: 'NL', countryName: 'Netherlands', currency: 'EUR', language: 'nl' },
  JP: { countryCode: 'JP', countryName: 'Japan', currency: 'JPY', language: 'ja' },
  CA: { countryCode: 'CA', countryName: 'Canada', currency: 'CAD', language: 'en' },
  AU: { countryCode: 'AU', countryName: 'Australia', currency: 'AUD', language: 'en' },
  SR: { countryCode: 'SR', countryName: 'Suriname', currency: 'SRD', language: 'nl' },
  PT: { countryCode: 'PT', countryName: 'Portugal', currency: 'EUR', language: 'pt' },
  GB: { countryCode: 'GB', countryName: 'United Kingdom', currency: 'GBP', language: 'en' },
};
