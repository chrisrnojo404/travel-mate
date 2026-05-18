import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors, radius, spacing } from '@/constants/theme';
import { usePreferencesStore } from '@/store/preferencesStore';

export default function DashboardScreen() {
  const router = useRouter();
  const homeCurrency = usePreferencesStore((state) => state.homeCurrency);
  const preferredLanguage = usePreferencesStore((state) => state.preferredLanguage);

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Coming next</Text>
        <Text style={styles.title}>Dashboard foundation is ready.</Text>
        <Text style={styles.description}>
          Your saved profile is using {homeCurrency} and {preferredLanguage.toUpperCase()}. In the
          next step we’ll turn this into the real TravelMate home dashboard with location-aware
          cards and quick actions.
        </Text>
      </View>

      <PrimaryButton label="Back to onboarding" onPress={() => router.push('/onboarding')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
});
