import { useCallback, useEffect, useState } from 'react';

import { getCurrentCountryProfile } from '@/services/locationService';
import { LocationResolution } from '@/types';

interface UseLocationProfileResult {
  loading: boolean;
  error: string | null;
  checkedAt: string | null;
  resolution: LocationResolution | null;
  refresh: () => Promise<void>;
}

export function useLocationProfile(): UseLocationProfileResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [resolution, setResolution] = useState<LocationResolution | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextResolution = await getCurrentCountryProfile();
      setResolution(nextResolution);
      setCheckedAt(new Date().toISOString());
    } catch (loadError) {
      setError('We could not check your location just now. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading,
    error,
    checkedAt,
    resolution,
    refresh,
  };
}
