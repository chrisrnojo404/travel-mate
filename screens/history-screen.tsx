import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DashboardCard } from '@/components/DashboardCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { currencyOptions, languageOptions } from '@/constants/options';
import { colors, radius, spacing } from '@/constants/theme';
import { useHistoryStore } from '@/store/historyStore';
import { CurrencyCode, LanguageCode } from '@/types';
import { formatTimestamp } from '@/utils/date';

export default function HistoryScreen() {
  const entries = useHistoryStore((state) => state.entries);

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Travel history</Text>
        </View>
        <Text style={styles.heroTitle}>See the places TravelMate has followed you.</Text>
        <Text style={styles.heroSubtitle}>
          This tab keeps a local record of visited countries based on your detected trip location.
        </Text>
      </View>

      <DashboardCard
        eyebrow="Summary"
        title={entries.length ? `${entries.length} places visited` : 'No trips recorded yet'}
        description={
          entries.length
            ? 'Your most recent destinations appear first, with repeat visits tracked over time.'
            : 'Travel history will start filling in automatically after location detection finds a country.'
        }
      >
        <View style={styles.summaryGrid}>
          <SummaryPill label="Countries" value={String(entries.length)} />
          <SummaryPill
            label="Repeat visits"
            value={String(entries.filter((entry) => entry.visitCount > 1).length)}
          />
        </View>
      </DashboardCard>

      <DashboardCard
        eyebrow="Visited places"
        title={entries.length ? 'Your travel log' : 'Start your first trip'}
        description={
          entries.length
            ? 'Saved locally on this device.'
            : 'TravelMate will add a country here when location detection confirms where you are.'
        }
      >
        {entries.length ? (
          <ScrollView horizontal={false} scrollEnabled={false} contentContainerStyle={styles.list}>
            {entries.map((entry) => (
              <View key={entry.countryCode} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyHeaderCopy}>
                    <Text style={styles.countryName}>{entry.countryName}</Text>
                    <Text style={styles.countryCode}>{entry.countryCode}</Text>
                  </View>
                  <View style={styles.visitBadge}>
                    <Text style={styles.visitBadgeText}>
                      {entry.visitCount} {entry.visitCount === 1 ? 'visit' : 'visits'}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaGrid}>
                  <MetaRow label="Currency" value={getCurrencyLabel(entry.currency)} />
                  <MetaRow label="Language" value={getLanguageLabel(entry.language)} />
                  <MetaRow label="First seen" value={formatTimestamp(entry.firstVisitedAt)} />
                  <MetaRow label="Last seen" value={formatTimestamp(entry.lastVisitedAt)} />
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nothing logged yet</Text>
            <Text style={styles.emptyText}>
              Open the Dashboard and allow location access. Once TravelMate detects a country, it
              will appear here automatically.
            </Text>
          </View>
        )}
      </DashboardCard>
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

function getCurrencyLabel(code: CurrencyCode): string {
  return currencyOptions.find((option) => option.code === code)?.label ?? code;
}

function getLanguageLabel(code: LanguageCode): string {
  return languageOptions.find((option) => option.code === code)?.label ?? code;
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
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  summaryPill: {
    flexGrow: 1,
    minWidth: '48%',
    backgroundColor: colors.card,
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
    color: colors.textDark,
    fontSize: 22,
    fontWeight: '800',
  },
  list: { gap: spacing.md },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  historyHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  countryName: {
    color: colors.textDark,
    fontSize: 22,
    fontWeight: '800',
  },
  countryCode: {
    color: '#5d7287',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  visitBadge: {
    backgroundColor: '#e6f7f2',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  visitBadgeText: {
    color: '#1b6e5f',
    fontSize: 12,
    fontWeight: '700',
  },
  metaGrid: { gap: spacing.sm },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#dbe8f3',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  metaLabel: {
    flex: 1,
    color: '#5d7287',
    fontSize: 14,
    fontWeight: '600',
  },
  metaValue: {
    flexShrink: 1,
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  emptyState: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
