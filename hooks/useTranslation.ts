import { useCallback, useState } from 'react';

import { translateText } from '@/services/translationService';
import { LanguageCode, TranslationResult } from '@/types';

interface UseTranslationResult {
  error: string | null;
  loading: boolean;
  result: TranslationResult | null;
  runTranslation: (text: string, sourceLanguage: LanguageCode, targetLanguage: LanguageCode) => Promise<void>;
}

export function useTranslation(): UseTranslationResult {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);

  const runTranslation = useCallback(
    async (text: string, sourceLanguage: LanguageCode, targetLanguage: LanguageCode) => {
      setLoading(true);
      setError(null);

      try {
        const nextResult = await translateText(text, sourceLanguage, targetLanguage);
        setResult(nextResult);
      } catch (translateError) {
        setError('We could not translate that text right now.');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    error,
    loading,
    result,
    runTranslation,
  };
}
