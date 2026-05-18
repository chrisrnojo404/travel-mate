import * as Location from 'expo-location';

import { countryProfiles, fallbackCountryProfile } from '@/constants/countryProfiles';
import { CountryProfile } from '@/types';

export async function getCurrentCountryProfile(): Promise<CountryProfile> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    return fallbackCountryProfile;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const geocode = await Location.reverseGeocodeAsync(position.coords);
  const countryCode = geocode[0]?.isoCountryCode?.toUpperCase();

  if (!countryCode) {
    return fallbackCountryProfile;
  }

  return countryProfiles[countryCode] ?? {
    ...fallbackCountryProfile,
    countryCode,
    countryName: geocode[0]?.country ?? fallbackCountryProfile.countryName,
  };
}
