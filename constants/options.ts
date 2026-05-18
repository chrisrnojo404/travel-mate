import { CurrencyOption, LanguageOption } from '@/types';

export const currencyOptions: CurrencyOption[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: 'EUR' },
  { code: 'GBP', label: 'British Pound', symbol: 'GBP' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CAD' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'AUD' },
  { code: 'JPY', label: 'Japanese Yen', symbol: 'JPY' },
  { code: 'SRD', label: 'Surinamese Dollar', symbol: 'SRD' },
];

export const languageOptions: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
];
