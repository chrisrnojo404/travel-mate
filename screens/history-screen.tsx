import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { ScreenContainer } from '@/components/ScreenContainer';
import { currencyOptions, languageOptions } from '@/constants/options';
import { colors, radius, spacing } from '@/constants/theme';
import { useLocationProfile } from '@/hooks/useLocationProfile';
import { getCurrentCountryProfile } from '@/services/locationService';
import { useHistoryStore } from '@/store/historyStore';
import { CurrencyCode, LanguageCode, TravelHistoryEntry } from '@/types';
import { formatTimestamp } from '@/utils/date';

export default function HistoryScreen() {
  const { loading: locationLoading } = useLocationProfile();
  const entries = useHistoryStore((state) => state.entries);
  const hydrated = useHistoryStore((state) => state.hydrated);
  const hydrate = useHistoryStore((state) => state.hydrate);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const recordVisit = useHistoryStore((state) => state.recordVisit);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  const latestEntry = entries[0];
  const visitedCountries = Array.from(
    new Map(entries.map((entry) => [entry.countryCode, entry])).values(),
  );

  const handleAddCurrentPlace = async () => {
    setFeedback(null);
    const resolvedAt = new Date().toISOString();
    const currentLocation = await getCurrentCountryProfile();

    if (!currentLocation.permissionGranted) {
      setFeedback('Allow location access so TravelMate can save your current place.');
      return;
    }

    await recordVisit(currentLocation.profile, resolvedAt);
    setFeedback(`Added ${currentLocation.profile.countryName} to your travel history.`);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear travel history?',
      'This will remove all locally saved visited places from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear history',
          style: 'destructive',
          onPress: () => {
            void clearHistory();
            setFeedback('Travel history cleared.');
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer
      backgroundColor="#f6f3ec"
      contentContainerStyle={styles.screenContent}
      showBackdrop={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>My trips</Text>
        </View>
        <Text style={styles.heroTitle}>See your trips come alive.</Text>
        <Text style={styles.heroSubtitle}>
          Automatic city stamps, repeat visits, and a clear trail of where TravelMate has followed
          you.
        </Text>
      </View>

      <View style={styles.featureCard}>
        <View style={styles.featureGlow} />
        <Text style={styles.featureEyebrow}>Latest stop</Text>
        <Text style={styles.featureTitle}>
          {latestEntry ? `${latestEntry.cityName.toUpperCase()}\nPASSPORT STAMP` : 'PASSPORT\nSTAMPS'}
        </Text>
        <Text style={styles.featureSubtitle}>
          {latestEntry
            ? `${latestEntry.countryName}${latestEntry.regionName ? `, ${latestEntry.regionName}` : ''}`
            : 'Your next detected city will appear here automatically.'}
        </Text>
        <View style={styles.featureFooter}>
          <View style={styles.featurePricePill}>
            <Text style={styles.featurePriceText}>
              {entries.length} {entries.length === 1 ? 'stop' : 'stops'}
            </Text>
          </View>
          <Pressable onPress={handleAddCurrentPlace} style={styles.featureAction}>
            <Text style={styles.featureActionText}>{locationLoading ? '...' : '+'}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trips you visited</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.countryRail}
      >
        {visitedCountries.length ? (
          visitedCountries.map((entry) => (
            <View key={entry.countryCode} style={styles.countryChip}>
              <Text style={styles.countryFlag}>{getFlagEmoji(entry.countryCode)}</Text>
              <Text style={styles.countryChipText}>{entry.countryName}</Text>
            </View>
          ))
        ) : (
          <View style={styles.countryChip}>
            <Text style={styles.countryChipText}>No destinations yet</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.summaryPanel}>
        <SummaryPill label="Cities" value={String(entries.length)} />
        <SummaryPill
          label="Countries"
          value={String(new Set(entries.map((entry) => entry.countryCode)).size)}
        />
        <SummaryPill
          label="Repeat stops"
          value={String(entries.filter((entry) => entry.visitCount > 1).length)}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>See your stamps</Text>
        <Pressable onPress={handleClearHistory}>
          <Text style={styles.sectionLink}>Clear all</Text>
        </Pressable>
      </View>

      {entries.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stampRail}>
          {entries.map((entry, index) => (
            <PassportStamp key={entry.id} entry={entry} stampNumber={entries.length - index} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No stamps yet</Text>
          <Text style={styles.emptyText}>
            Open the Dashboard and allow location access. Once TravelMate detects a city, it will
            appear here automatically.
          </Text>
        </View>
      )}

      <View style={styles.controlBar}>
        <Pressable onPress={handleAddCurrentPlace} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            {locationLoading ? 'Checking...' : 'Add current place'}
          </Text>
        </Pressable>
      </View>
      {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
    </ScreenContainer>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryPill}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function PassportStamp({
  entry,
  stampNumber,
}: {
  entry: TravelHistoryEntry;
  stampNumber: number;
}) {
  return (
    <View style={styles.stampCard}>
      <Text style={styles.stampCountry}>{entry.countryCode}</Text>
      <Text style={styles.stampCity}>{entry.cityName}</Text>
      <Text style={styles.stampDate}>
        {new Date(entry.lastVisitedAt).toLocaleDateString(undefined, {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })}
      </Text>
      <Text style={styles.stampOrdinal}>Stamp #{stampNumber}</Text>
      <View style={styles.stampMetaGrid}>
        <MetaRow label="Country" value={entry.countryName} />
        <MetaRow
          label="Language"
          value={getLanguageLabel(entry.language)}
        />
      </View>
    </View>
  );
}

function getCurrencyLabel(code: CurrencyCode): string {
  return currencyOptions.find((option) => option.code === code)?.label ?? code;
}

function getLanguageLabel(code: LanguageCode): string {
  return languageOptions.find((option) => option.code === code)?.label ?? code;
}

function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const styles = StyleSheet.create({
  screenContent: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dce8d8',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  heroBadgeText: {
    color: '#24905c',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 42,
    maxWidth: 360,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    maxWidth: 430,
  },
  featureCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#133645',
    borderRadius: 30,
    padding: spacing.xl,
    gap: spacing.sm,
    minHeight: 240,
    justifyContent: 'space-between',
  },
  featureGlow: {
    position: 'absolute',
    right: -32,
    top: -24,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(25, 194, 160, 0.14)',
  },
  featureEyebrow: {
    color: '#8bd9c7',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  featureTitle: {
    color: '#f4f8fb',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 36,
  },
  featureSubtitle: {
    color: '#c0d1dc',
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 260,
  },
  featureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  featurePricePill: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  featurePriceText: {
    color: '#f4f8fb',
    fontSize: 16,
    fontWeight: '800',
  },
  featureAction: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#93f05d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureActionText: {
    color: '#163427',
    fontSize: 28,
    fontWeight: '700',
    marginTop: -2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '800',
  },
  sectionLink: {
    color: '#1f5d2f',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  countryRail: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1dfd7',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  countryFlag: {
    fontSize: 26,
  },
  countryChipText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
  summaryPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  summaryPill: {
    flexGrow: 1,
    minWidth: '31%',
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  summaryLabel: {
    color: '#5d7287',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '800',
  },
  stampRail: {
    gap: spacing.lg,
    paddingRight: spacing.lg,
    paddingBottom: spacing.sm,
  },
  controlBar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flexGrow: 1,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#d8d6cf',
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
  feedbackText: {
    color: '#1f5d2f',
    fontSize: 13,
    fontWeight: '700',
  },
  stampCard: {
    width: 250,
    borderRadius: 26,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#a96839',
    backgroundColor: '#fffaf4',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    transform: [{ rotate: '-5deg' }],
  },
  stampCountry: {
    color: '#8d5430',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stampCity: {
    color: '#8d5430',
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  stampDate: {
    color: '#8d5430',
    fontSize: 14,
    fontWeight: '700',
  },
  stampOrdinal: {
    color: '#b47a56',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stampMetaGrid: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metaGrid: { gap: spacing.sm },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#ead8ca',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  metaLabel: {
    flex: 1,
    color: '#8d5430',
    fontSize: 14,
    fontWeight: '600',
  },
  metaValue: {
    flexShrink: 1,
    color: '#5b341b',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  emptyState: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#d8d6cf',
    backgroundColor: '#ffffff',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#5a5f66',
    fontSize: 14,
    lineHeight: 20,
  },
});
