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

function getEntryId(profile: CountryProfile): string {
  return `${profile.countryCode}:${profile.cityName.trim().toLowerCase()}`;
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
        const parsedEntries = JSON.parse(raw) as Partial<TravelHistoryEntry>[];
        set({
          entries: parsedEntries.map((entry) => ({
            id:
              entry.id ??
              `${entry.countryCode ?? 'XX'}:${(entry.cityName ?? entry.countryName ?? 'unknown')
                .trim()
                .toLowerCase()}`,
            countryCode: entry.countryCode ?? 'XX',
            countryName: entry.countryName ?? 'Unknown Country',
            cityName: entry.cityName ?? entry.countryName ?? 'Unknown City',
            regionName: entry.regionName,
            currency: entry.currency ?? 'USD',
            language: entry.language ?? 'en',
            firstVisitedAt: entry.firstVisitedAt ?? new Date().toISOString(),
            lastVisitedAt: entry.lastVisitedAt ?? entry.firstVisitedAt ?? new Date().toISOString(),
            visitCount: entry.visitCount ?? 1,
          })),
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
    const entryId = getEntryId(profile);
    const existingEntry = currentEntries.find((entry) => entry.id === entryId);

    let nextEntries: TravelHistoryEntry[];

    if (!existingEntry) {
      nextEntries = [
        {
          id: entryId,
          countryCode: profile.countryCode,
          countryName: profile.countryName,
          cityName: profile.cityName,
          regionName: profile.regionName,
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
        if (entry.id !== entryId) {
          return entry;
        }

        return {
          ...entry,
          countryName: profile.countryName,
          cityName: profile.cityName,
          regionName: profile.regionName,
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
    set({ entries: [], hydrated: true });
  },
}));
