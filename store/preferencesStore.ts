import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { UserPreferences, CurrencyCode, LanguageCode } from '@/types';
import { STORAGE_KEYS } from '@/utils/storage';

interface PreferencesStore extends UserPreferences {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setHomeCurrency: (currency: CurrencyCode) => Promise<void>;
  setPreferredLanguage: (language: LanguageCode) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  clearPreferences: () => Promise<void>;
  setHydrated: (hydrated: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  homeCurrency: 'USD',
  preferredLanguage: 'en',
  onboardingCompleted: false,
};

async function persistPreferences(preferences: UserPreferences): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(preferences));
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  ...defaultPreferences,
  hydrated: false,
  hydrate: async () => {
    try {
      const rawPreferences = await AsyncStorage.getItem(STORAGE_KEYS.preferences);

      if (rawPreferences) {
        const parsedPreferences = JSON.parse(rawPreferences) as Partial<UserPreferences>;

        set({
          ...defaultPreferences,
          ...parsedPreferences,
          hydrated: true,
        });
        return;
      }
    } catch (error) {
      // If reading cached preferences fails, continue with safe defaults.
    }

    set({
      ...defaultPreferences,
      hydrated: true,
    });
  },
  setHomeCurrency: async (homeCurrency) => {
    const nextPreferences = {
      homeCurrency,
      preferredLanguage: get().preferredLanguage,
      onboardingCompleted: get().onboardingCompleted,
    };

    set({ homeCurrency });
    await persistPreferences(nextPreferences);
  },
  setPreferredLanguage: async (preferredLanguage) => {
    const nextPreferences = {
      homeCurrency: get().homeCurrency,
      preferredLanguage,
      onboardingCompleted: get().onboardingCompleted,
    };

    set({ preferredLanguage });
    await persistPreferences(nextPreferences);
  },
  completeOnboarding: async () => {
    const nextPreferences = {
      homeCurrency: get().homeCurrency,
      preferredLanguage: get().preferredLanguage,
      onboardingCompleted: true,
    };

    set({ onboardingCompleted: true });
    await persistPreferences(nextPreferences);
  },
  clearPreferences: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.preferences);

    set({
      ...defaultPreferences,
      hydrated: true,
    });
  },
  setHydrated: (hydrated) => set({ hydrated }),
}));
