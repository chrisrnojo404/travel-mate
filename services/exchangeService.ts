import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/utils/storage';
import { CurrencyCode, ExchangeRateCache } from '@/types';

const EXCHANGE_API_URL = process.env.EXPO_PUBLIC_EXCHANGE_API_URL;
const EXCHANGE_API_KEY = process.env.EXPO_PUBLIC_EXCHANGE_API_KEY;

const mockRates: Record<CurrencyCode, Record<CurrencyCode, number>> = {
  USD: { USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.37, AUD: 1.52, JPY: 155.2, SRD: 36.4 },
  EUR: { USD: 1.09, EUR: 1, GBP: 0.86, CAD: 1.49, AUD: 1.66, JPY: 168.8, SRD: 39.5 },
  GBP: { USD: 1.27, EUR: 1.16, GBP: 1, CAD: 1.74, AUD: 1.93, JPY: 196.4, SRD: 45.7 },
  CAD: { USD: 0.73, EUR: 0.67, GBP: 0.57, CAD: 1, AUD: 1.11, JPY: 113.1, SRD: 26.4 },
  AUD: { USD: 0.66, EUR: 0.6, GBP: 0.52, CAD: 0.9, AUD: 1, JPY: 101.9, SRD: 23.8 },
  JPY: { USD: 0.0064, EUR: 0.0059, GBP: 0.0051, CAD: 0.0088, AUD: 0.0098, JPY: 1, SRD: 0.23 },
  SRD: { USD: 0.027, EUR: 0.025, GBP: 0.022, CAD: 0.038, AUD: 0.042, JPY: 4.27, SRD: 1 },
};

function getMockRate(baseCurrency: CurrencyCode, targetCurrency: CurrencyCode): number {
  return mockRates[baseCurrency]?.[targetCurrency] ?? 1;
}

export async function getExchangeRate(
  baseCurrency: CurrencyCode,
  targetCurrency: CurrencyCode,
): Promise<ExchangeRateCache> {
  if (baseCurrency === targetCurrency) {
    return {
      baseCurrency,
      targetCurrency,
      rate: 1,
      updatedAt: new Date().toISOString(),
    };
  }

  if (!EXCHANGE_API_URL || !EXCHANGE_API_KEY) {
    const fallback = {
      baseCurrency,
      targetCurrency,
      rate: getMockRate(baseCurrency, targetCurrency),
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEYS.rates, JSON.stringify(fallback));
    return fallback;
  }

  try {
    const response = await fetch(
      `${EXCHANGE_API_URL}?base=${baseCurrency}&symbols=${targetCurrency}&apiKey=${EXCHANGE_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error('Exchange rate request failed.');
    }

    const data = await response.json();
    const rate = data?.rates?.[targetCurrency];

    if (typeof rate !== 'number') {
      throw new Error('Exchange rate missing from response.');
    }

    const payload = {
      baseCurrency,
      targetCurrency,
      rate,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEYS.rates, JSON.stringify(payload));
    return payload;
  } catch (error) {
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.rates);

    if (cached) {
      return JSON.parse(cached) as ExchangeRateCache;
    }

    return {
      baseCurrency,
      targetCurrency,
      rate: getMockRate(baseCurrency, targetCurrency),
      updatedAt: new Date().toISOString(),
    };
  }
}
