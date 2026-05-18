import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { CountryProfile, TravelHistoryEntry } from '@/types';
import { STORAGE_KEYS } from '@/utils/storage';

interface HistoryStore {
  entries: TravelHistoryEntry[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  recordVisit: (profile: CountryProfile, visitedAt?: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

async function persistEntries(entries: TravelHistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(entries));
}

function isSameCalendarDay(first: string, second: string): boolean {
  return new Date(first).toDateString() === new Date(second).toDateString();
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  entries: [],
  hydrated: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.history);
      if (raw) {
        set({
          entries: JSON.parse(raw) as TravelHistoryEntry[],
          hydrated: true,
        });
        return;
      }
    } catch (error) {
      // Fall back to an empty history if persistence fails.
    }

    set({
      entries: [],
      hydrated: true,
    });
  },
  recordVisit: async (profile, visitedAt = new Date().toISOString()) => {
    const currentEntries = get().entries;
    const existingEntry = currentEntries.find((entry) => entry.countryCode === profile.countryCode);

    let nextEntries: TravelHistoryEntry[];

    if (!existingEntry) {
      nextEntries = [
        {
          countryCode: profile.countryCode,
          countryName: profile.countryName,
          currency: profile.currency,
          language: profile.language,
          firstVisitedAt: visitedAt,
          lastVisitedAt: visitedAt,
          visitCount: 1,
        },
        ...currentEntries,
      ];
    } else {
      nextEntries = currentEntries.map((entry) => {
        if (entry.countryCode !== profile.countryCode) {
          return entry;
        }

        return {
          ...entry,
          countryName: profile.countryName,
          currency: profile.currency,
          language: profile.language,
          lastVisitedAt: visitedAt,
          visitCount: isSameCalendarDay(entry.lastVisitedAt, visitedAt)
            ? entry.visitCount
            : entry.visitCount + 1,
        };
      });

      nextEntries.sort(
        (first, second) =>
          new Date(second.lastVisitedAt).getTime() - new Date(first.lastVisitedAt).getTime(),
      );
    }

    set({ entries: nextEntries });
    await persistEntries(nextEntries);
  },
  clearHistory: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.history);
    set({ entries: [] });
  },
}));
