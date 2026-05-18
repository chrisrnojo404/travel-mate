import { useEffect } from 'react';

import { LocationResolution } from '@/types';
import { useHistoryStore } from '@/store/historyStore';

export function useTravelHistoryTracker(
  resolution: LocationResolution | null,
  checkedAt: string | null,
): void {
  const hydrated = useHistoryStore((state) => state.hydrated);
  const hydrate = useHistoryStore((state) => state.hydrate);
  const recordVisit = useHistoryStore((state) => state.recordVisit);

  useEffect(() => {
    if (!hydrated) {
      hydrate();
    }
  }, [hydrate, hydrated]);

  useEffect(() => {
    if (!hydrated || !resolution?.permissionGranted || !checkedAt) {
      return;
    }

    void recordVisit(resolution.profile, checkedAt);
  }, [checkedAt, hydrated, recordVisit, resolution]);
}
