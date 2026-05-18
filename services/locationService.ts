import * as Location from 'expo-location';

import { countryProfiles, fallbackCountryProfile } from '@/constants/countryProfiles';
import { LocationResolution } from '@/types';

export async function getCurrentCountryProfile(): Promise<LocationResolution> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    return {
      profile: fallbackCountryProfile,
      permissionGranted: false,
      usedFallback: true,
    };
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const geocode = await Location.reverseGeocodeAsync(position.coords);
  const cityName =
    geocode[0]?.city ??
    geocode[0]?.district ??
    geocode[0]?.subregion ??
    geocode[0]?.region ??
    fallbackCountryProfile.cityName;
  const regionName = geocode[0]?.region ?? geocode[0]?.subregion ?? undefined;
  const countryCode = geocode[0]?.isoCountryCode?.toUpperCase();

  if (!countryCode) {
    return {
      profile: fallbackCountryProfile,
      permissionGranted: true,
      usedFallback: true,
    };
  }

  return {
    profile:
      {
        ...(countryProfiles[countryCode] ?? {
          ...fallbackCountryProfile,
          countryCode,
          countryName: geocode[0]?.country ?? fallbackCountryProfile.countryName,
        }),
        cityName,
        regionName,
      },
    permissionGranted: true,
    usedFallback: !countryProfiles[countryCode],
  };
}
