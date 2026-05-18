import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { UserPreferences, CurrencyCode, LanguageCode } from '@/types';
import { STORAGE_KEYS } from '@/utils/storage';

interface PreferencesStore extends UserPreferences {
  hydrated: boolean;
  setHomeCurrency: (currency: CurrencyCode) => void;
  setPreferredLanguage: (language: LanguageCode) => void;
  completeOnboarding: () => void;
  clearPreferences: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  homeCurrency: 'USD',
  preferredLanguage: 'en',
  onboardingCompleted: false,
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      hydrated: false,
      setHomeCurrency: (homeCurrency) => set({ homeCurrency }),
      setPreferredLanguage: (preferredLanguage) => set({ preferredLanguage }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      clearPreferences: () =>
        set({
          ...defaultPreferences,
          hydrated: true,
        }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: STORAGE_KEYS.preferences,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: ({ homeCurrency, preferredLanguage, onboardingCompleted }) => ({
        homeCurrency,
        preferredLanguage,
        onboardingCompleted,
      }),
    },
  ),
);
