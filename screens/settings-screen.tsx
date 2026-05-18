import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DashboardCard } from '@/components/DashboardCard';
import { PickerField } from '@/components/PickerField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { currencyOptions, languageOptions } from '@/constants/options';
import { colors, radius, spacing } from '@/constants/theme';
import { usePreferencesStore } from '@/store/preferencesStore';
import { CurrencyCode, LanguageCode } from '@/types';
import { CACHE_STORAGE_KEYS } from '@/utils/storage';

export default function SettingsScreen() {
  const homeCurrency = usePreferencesStore((state) => state.homeCurrency);
  const preferredLanguage = usePreferencesStore((state) => state.preferredLanguage);
  const setHomeCurrency = usePreferencesStore((state) => state.setHomeCurrency);
  const setPreferredLanguage = usePreferencesStore((state) => state.setPreferredLanguage);

  const [draftCurrency, setDraftCurrency] = useState<CurrencyCode>(homeCurrency);
  const [draftLanguage, setDraftLanguage] = useState<LanguageCode>(preferredLanguage);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await setHomeCurrency(draftCurrency);
      await setPreferredLanguage(draftLanguage);
      setFeedback('Preferences saved');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    setClearing(true);
    setFeedback(null);
    try {
      await AsyncStorage.multiRemove([...CACHE_STORAGE_KEYS]);
      setFeedback('Cached exchange and translation data cleared');
    } finally {
      setClearing(false);
    }
  };

  const confirmClearCache = () => {
    Alert.alert(
      'Clear cached data?',
      'This removes saved exchange rates and translation cache, but keeps your travel preferences.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear cache', style: 'destructive', onPress: () => void handleClearCache() },
      ],
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Settings</Text>
        </View>
        <Text style={styles.heroTitle}>Tune TravelMate to how you travel.</Text>
        <Text style={styles.heroSubtitle}>
          Update your default currency and language, then clear cached data whenever you want a
          fresh sync.
        </Text>
      </View>

      <DashboardCard
        eyebrow="Preferences"
        title="Traveler defaults"
        description="These values drive your converter, translator, and phrasebook starting points."
      >
        <View style={styles.selectorBlock}>
          <Text style={styles.inputLabel}>Home currency</Text>
          <PickerField
            selectedValue={draftCurrency}
            onValueChange={(value) => setDraftCurrency(value as CurrencyCode)}
            items={currencyOptions.map((option) => ({
              label: `${option.label} (${option.code})`,
              value: option.code,
            }))}
          />
        </View>

        <View style={styles.selectorBlock}>
          <Text style={styles.inputLabel}>Preferred language</Text>
          <PickerField
            selectedValue={draftLanguage}
            onValueChange={(value) => setDraftLanguage(value as LanguageCode)}
            items={languageOptions.map((option) => ({
              label: option.label,
              value: option.code,
            }))}
          />
        </View>

        <PrimaryButton label={saving ? 'Saving...' : 'Save preferences'} onPress={handleSave} loading={saving} />
      </DashboardCard>

      <DashboardCard
        eyebrow="Storage"
        title="Cached app data"
        description="Clear temporary data when you want to force fresh exchange rates and translations on your next lookup."
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What gets cleared?</Text>
          <Text style={styles.infoText}>Saved exchange rates</Text>
          <Text style={styles.infoText}>Saved translation cache</Text>
          <Text style={styles.infoSubtext}>Your home currency and preferred language stay intact.</Text>
        </View>

        <Pressable onPress={confirmClearCache} style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>{clearing ? 'Clearing...' : 'Clear cached data'}</Text>
        </Pressable>
      </DashboardCard>

      <DashboardCard
        eyebrow="Current values"
        title="Saved profile snapshot"
        description="This shows what the app is currently using as your persistent defaults."
      >
        <View style={styles.profileGrid}>
          <ProfileRow label="Saved home currency" value={getCurrencyLabel(homeCurrency)} />
          <ProfileRow label="Saved preferred language" value={getLanguageLabel(preferredLanguage)} />
          <ProfileRow label="Cache reset action" value="Manual from this screen" />
        </View>
        {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
      </DashboardCard>
    </ScreenContainer>
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
  heroBadgeText: { color: colors.accent, fontSize: 13, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  heroTitle: { color: colors.textPrimary, fontSize: 34, fontWeight: '800', lineHeight: 40 },
  heroSubtitle: { color: colors.textSecondary, fontSize: 16, lineHeight: 24 },
  selectorBlock: { gap: spacing.sm },
  inputLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  infoCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs },
  infoTitle: { color: colors.textDark, fontSize: 18, fontWeight: '800' },
  infoText: { color: '#48627a', fontSize: 14, lineHeight: 20 },
  infoSubtext: { marginTop: spacing.xs, color: '#6c8297', fontSize: 13, lineHeight: 18 },
  dangerButton: {
    minHeight: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  dangerButtonText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
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
  profileValue: { flexShrink: 1, color: colors.textPrimary, fontSize: 14, fontWeight: '700', textAlign: 'right' },
  feedbackText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
});
