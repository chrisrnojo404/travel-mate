import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';

import { colors, spacing } from '@/constants/theme';
import { usePreferencesStore } from '@/store/preferencesStore';

export default function IndexScreen() {
  const hydrated = usePreferencesStore((state) => state.hydrated);
  const onboardingCompleted = usePreferencesStore((state) => state.onboardingCompleted);
  const hydrate = usePreferencesStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.text}>Loading TravelMate AI...</Text>
      </View>
    );
  }

  return <Redirect href={onboardingCompleted ? '/(tabs)/dashboard' : '/onboarding'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
