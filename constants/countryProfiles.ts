import { CountryProfile } from '@/types';

export const fallbackCountryProfile: CountryProfile = {
  countryCode: 'US',
  countryName: 'United States',
  cityName: 'Unknown City',
  currency: 'USD',
  language: 'en',
};

export const countryProfiles: Record<string, CountryProfile> = {
  US: fallbackCountryProfile,
  FR: { countryCode: 'FR', countryName: 'France', cityName: 'Unknown City', currency: 'EUR', language: 'fr' },
  ES: { countryCode: 'ES', countryName: 'Spain', cityName: 'Unknown City', currency: 'EUR', language: 'es' },
  DE: { countryCode: 'DE', countryName: 'Germany', cityName: 'Unknown City', currency: 'EUR', language: 'de' },
  NL: { countryCode: 'NL', countryName: 'Netherlands', cityName: 'Unknown City', currency: 'EUR', language: 'nl' },
  JP: { countryCode: 'JP', countryName: 'Japan', cityName: 'Unknown City', currency: 'JPY', language: 'ja' },
  CA: { countryCode: 'CA', countryName: 'Canada', cityName: 'Unknown City', currency: 'CAD', language: 'en' },
  AU: { countryCode: 'AU', countryName: 'Australia', cityName: 'Unknown City', currency: 'AUD', language: 'en' },
  SR: { countryCode: 'SR', countryName: 'Suriname', cityName: 'Unknown City', currency: 'SRD', language: 'nl' },
  PT: { countryCode: 'PT', countryName: 'Portugal', cityName: 'Unknown City', currency: 'EUR', language: 'pt' },
  GB: { countryCode: 'GB', countryName: 'United Kingdom', cityName: 'Unknown City', currency: 'GBP', language: 'en' },
};
