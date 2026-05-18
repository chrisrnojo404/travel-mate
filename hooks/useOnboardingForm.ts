import { useMemo, useState } from 'react';

import { currencyOptions, languageOptions } from '@/constants/options';
import { CurrencyCode, LanguageCode } from '@/types';

export function useOnboardingForm(initialCurrency: CurrencyCode, initialLanguage: LanguageCode) {
  const [homeCurrency, setHomeCurrency] = useState<CurrencyCode>(initialCurrency);
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(initialLanguage);

  const currencyLabel = useMemo(
    () => currencyOptions.find((option) => option.code === homeCurrency)?.label ?? homeCurrency,
    [homeCurrency],
  );

  const languageLabel = useMemo(
    () =>
      languageOptions.find((option) => option.code === preferredLanguage)?.label ??
      preferredLanguage,
    [preferredLanguage],
  );

  return {
    homeCurrency,
    preferredLanguage,
    currencyLabel,
    languageLabel,
    setHomeCurrency,
    setPreferredLanguage,
  };
}
