import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PickerField } from '@/components/PickerField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SelectionCard } from '@/components/SelectionCard';
import { currencyOptions, languageOptions } from '@/constants/options';
import { colors, radius, spacing } from '@/constants/theme';
import { useOnboardingForm } from '@/hooks/useOnboardingForm';
import { usePreferencesStore } from '@/store/preferencesStore';
import { CurrencyCode, LanguageCode } from '@/types';

export default function OnboardingScreen() {
  const router = useRouter();
  const savedCurrency = usePreferencesStore((state) => state.homeCurrency);
  const savedLanguage = usePreferencesStore((state) => state.preferredLanguage);
  const setHomeCurrency = usePreferencesStore((state) => state.setHomeCurrency);
  const setPreferredLanguage = usePreferencesStore((state) => state.setPreferredLanguage);
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);

  const {
    homeCurrency,
    preferredLanguage,
    currencyLabel,
    languageLabel,
    setHomeCurrency: updateHomeCurrency,
    setPreferredLanguage: updatePreferredLanguage,
  } = useOnboardingForm(savedCurrency, savedLanguage);

  const handleContinue = () => {
    setHomeCurrency(homeCurrency as CurrencyCode);
    setPreferredLanguage(preferredLanguage as LanguageCode);
    completeOnboarding();
    router.replace('/(tabs)/dashboard');
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>TravelMate AI</Text>
        </View>
        <Text style={styles.title}>Set your home travel profile</Text>
        <Text style={styles.subtitle}>
          Pick the currency you spend in most and the language you want TravelMate to translate
          from by default.
        </Text>
      </View>

      <SelectionCard
        title="Home currency"
        description="We’ll use this as the default source currency when you travel."
      >
        <PickerField
          selectedValue={homeCurrency}
          onValueChange={(value) => updateHomeCurrency(value as CurrencyCode)}
          items={currencyOptions.map((option) => ({
            label: `${option.label} (${option.code})`,
            value: option.code,
          }))}
        />
      </SelectionCard>

      <SelectionCard
        title="Preferred language"
        description="We’ll translate from this language into the local language around you."
      >
        <PickerField
          selectedValue={preferredLanguage}
          onValueChange={(value) => updatePreferredLanguage(value as LanguageCode)}
          items={languageOptions.map((option) => ({
            label: option.label,
            value: option.code,
          }))}
        />
      </SelectionCard>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Ready to go</Text>
        <Text style={styles.summaryValue}>
          {currencyLabel} and {languageLabel}
        </Text>
        <Text style={styles.summaryText}>
          You can change both any time later from Settings.
        </Text>
        <View style={styles.summaryMetaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillText}>Currency ready</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillText}>Language ready</Text>
          </View>
        </View>
      </View>

      <PrimaryButton label="Continue to dashboard" onPress={handleContinue} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(25, 194, 160, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 480,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryValue: {
    color: colors.textDark,
    fontSize: 24,
    fontWeight: '800',
  },
  summaryText: {
    color: '#48627a',
    fontSize: 14,
    lineHeight: 20,
  },
  summaryMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metaPill: {
    backgroundColor: '#e6f7f2',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  metaPillText: {
    color: '#1b6e5f',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
