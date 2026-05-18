import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DashboardCard } from '@/components/DashboardCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { QuickActionTile } from '@/components/QuickActionTile';
import { currencyOptions, languageOptions } from '@/constants/options';
import { colors, radius, spacing } from '@/constants/theme';
import { useLocationProfile } from '@/hooks/useLocationProfile';
import { useTravelHistoryTracker } from '@/hooks/useTravelHistoryTracker';
import { usePreferencesStore } from '@/store/preferencesStore';
import { CountryProfile, CurrencyCode, LanguageCode } from '@/types';
import { formatTimestamp } from '@/utils/date';

export default function DashboardScreen() {
  const router = useRouter();
  const homeCurrency = usePreferencesStore((state) => state.homeCurrency);
  const preferredLanguage = usePreferencesStore((state) => state.preferredLanguage);
  const { loading, error, checkedAt, resolution, refresh } = useLocationProfile();
  useTravelHistoryTracker(resolution, checkedAt);

  const locationProfile = resolution?.profile;
  const localCurrencyLabel = getCurrencyLabel(locationProfile?.currency ?? homeCurrency);
  const localLanguageLabel = getLanguageLabel(locationProfile?.language ?? preferredLanguage);
  const homeCurrencyLabel = getCurrencyLabel(homeCurrency);
  const preferredLanguageLabel = getLanguageLabel(preferredLanguage);

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Dashboard</Text>
        </View>
        <Text style={styles.heroTitle}>Travel smarter the moment you land.</Text>
        <Text style={styles.heroSubtitle}>
          TravelMate is ready to adapt your currency and language tools to the place around you.
        </Text>
      </View>

      <DashboardCard
        eyebrow="Current trip"
        title={loading ? 'Finding your location...' : getLocationTitle(locationProfile)}
        description={getLocationDescription({
          loading,
          error,
          permissionGranted: resolution?.permissionGranted ?? false,
          usedFallback: resolution?.usedFallback ?? false,
        })}
        accessory={
          <Pressable onPress={refresh} style={styles.refreshButton}>
            <Text style={styles.refreshText}>{loading ? '...' : 'Refresh'}</Text>
          </Pressable>
        }
      >
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Checking your country, currency, and local language.</Text>
          </View>
        ) : (
          <View style={styles.metricGrid}>
            <MetricPill label="Country" value={locationProfile?.countryName ?? 'Unavailable'} />
            <MetricPill label="Local currency" value={localCurrencyLabel} />
            <MetricPill label="Local language" value={localLanguageLabel} />
          </View>
        )}
      </DashboardCard>

      <DashboardCard
        eyebrow="Your defaults"
        title="Saved traveler profile"
        description="These preferences came from onboarding and will be used across conversions and translations."
      >
        <View style={styles.profileGrid}>
          <ProfileRow label="Home currency" value={homeCurrencyLabel} />
          <ProfileRow label="Preferred language" value={preferredLanguageLabel} />
          <ProfileRow
            label="Location mode"
            value={resolution?.permissionGranted ? 'Automatic' : 'Fallback defaults'}
          />
          <ProfileRow
            label="Last checked"
            value={loading || !checkedAt ? 'Updating now' : formatTimestamp(checkedAt)}
          />
        </View>
      </DashboardCard>

      <DashboardCard
        eyebrow="Quick actions"
        title="Your next travel tools"
        description="Open the full tools directly or jump there from the menu below."
      >
        <View style={styles.actionGrid}>
          <QuickActionTile
            title="Currency converter"
            description="Convert from your home currency into the local one with cached exchange rates."
            onPress={() => router.push('/(tabs)/converter')}
          />
          <QuickActionTile
            title="Translator"
            description="Translate phrases from your preferred language into the language around you."
            onPress={() => router.push('/(tabs)/translator')}
          />
          <QuickActionTile
            title="Travel phrases"
            description="Open essential travel phrases already targeted to the detected local language."
            onPress={() => router.push('/(tabs)/phrases')}
          />
          <QuickActionTile
            title="Settings"
            description="Adjust your defaults, clear cached data, or switch to manual preferences."
            onPress={() => router.push('/(tabs)/settings')}
          />
          <QuickActionTile
            title="Travel history"
            description="Review countries you have visited and the local details TravelMate recorded."
            onPress={() => router.push('/(tabs)/history')}
          />
        </View>
      </DashboardCard>
    </ScreenContainer>
  );
}

function getCurrencyLabel(code: CurrencyCode): string {
  return currencyOptions.find((option) => option.code === code)?.label ?? code;
}

function getLanguageLabel(code: LanguageCode): string {
  return languageOptions.find((option) => option.code === code)?.label ?? code;
}

function getLocationTitle(profile?: CountryProfile): string {
  if (!profile) {
    return 'Location unavailable';
  }

  return `You appear to be in ${profile.countryName}`;
}

function getLocationDescription(input: {
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
  usedFallback: boolean;
}): string {
  if (input.loading) {
    return 'We are matching your current country to its local currency and main language.';
  }
  if (input.error) {
    return input.error;
  }
  if (!input.permissionGranted) {
    return 'Location access is off, so TravelMate is using safe fallback defaults until you allow permission.';
  }
  if (input.usedFallback) {
    return 'We found your location but used fallback defaults because the country is not mapped yet.';
  }
  return 'Your dashboard is now tuned to local money and language context.';
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricPill}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.md },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(25, 194, 160, 0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  heroBadgeText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  heroTitle: { color: colors.textPrimary, fontSize: 34, fontWeight: '800', lineHeight: 40 },
  heroSubtitle: { color: colors.textSecondary, fontSize: 16, lineHeight: 24 },
  refreshButton: {
    minWidth: 84,
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  refreshText: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  loadingState: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  loadingText: { flex: 1, color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metricPill: {
    minWidth: '48%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  metricLabel: {
    color: '#5d7287',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  metricValue: { color: colors.textDark, fontSize: 18, fontWeight: '800', lineHeight: 24 },
  profileGrid: { gap: spacing.sm },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  profileLabel: { flex: 1, color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  profileValue: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
});
