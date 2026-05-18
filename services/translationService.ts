import { LanguageCode, TranslationResult } from '@/types';

const TRANSLATION_API_URL = process.env.EXPO_PUBLIC_TRANSLATION_API_URL;
const TRANSLATION_API_KEY = process.env.EXPO_PUBLIC_TRANSLATION_API_KEY;

const phraseDictionary: Record<string, Partial<Record<LanguageCode, string>>> = {
  'How much does this cost?': {
    es: 'Cuanto cuesta esto?',
    fr: 'Combien cela coute-t-il ?',
    nl: 'Hoeveel kost dit?',
    pt: 'Quanto custa isto?',
    de: 'Wie viel kostet das?',
    ja: 'Kore wa ikura desu ka?',
  },
  'Where is the bathroom?': {
    es: 'Donde esta el bano?',
    fr: 'Ou sont les toilettes ?',
    nl: 'Waar is het toilet?',
    pt: 'Onde fica o banheiro?',
    de: 'Wo ist die Toilette?',
    ja: 'Toire wa doko desu ka?',
  },
};

function buildMockTranslation(text: string, targetLanguage: LanguageCode): string {
  return phraseDictionary[text]?.[targetLanguage] ?? `[${targetLanguage.toUpperCase()}] ${text}`;
}

export async function translateText(
  text: string,
  sourceLanguage: LanguageCode,
  targetLanguage: LanguageCode,
): Promise<TranslationResult> {
  if (!TRANSLATION_API_URL || !TRANSLATION_API_KEY) {
    return {
      translatedText: buildMockTranslation(text, targetLanguage),
      sourceLanguage,
      targetLanguage,
      provider: 'mock',
    };
  }

  try {
    const response = await fetch(TRANSLATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TRANSLATION_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation request failed.');
    }

    const data = await response.json();
    const translatedText = data?.translatedText;

    if (typeof translatedText !== 'string') {
      throw new Error('Translation response missing text.');
    }

    return {
      translatedText,
      sourceLanguage,
      targetLanguage,
      provider: 'api',
    };
  } catch (error) {
    return {
      translatedText: buildMockTranslation(text, targetLanguage),
      sourceLanguage,
      targetLanguage,
      provider: 'mock',
    };
  }
}
