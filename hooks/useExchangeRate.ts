import { useCallback, useEffect, useState } from 'react';

import { getExchangeRate } from '@/services/exchangeService';
import { CurrencyCode, ExchangeRateCache } from '@/types';

interface UseExchangeRateResult {
  error: string | null;
  loading: boolean;
  rateData: ExchangeRateCache | null;
  refresh: () => Promise<void>;
}

export function useExchangeRate(
  baseCurrency: CurrencyCode,
  targetCurrency: CurrencyCode,
): UseExchangeRateResult {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rateData, setRateData] = useState<ExchangeRateCache | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextRate = await getExchangeRate(baseCurrency, targetCurrency);
      setRateData(nextRate);
    } catch (loadError) {
      setError('We could not update exchange rates right now.');
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, targetCurrency]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    error,
    loading,
    rateData,
    refresh,
  };
}
