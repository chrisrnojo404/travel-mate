import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { DashboardCard } from '@/components/DashboardCard';
import { PickerField } from '@/components/PickerField';
import { ScreenContainer } from '@/components/ScreenContainer';
import { currencyOptions } from '@/constants/options';
import { colors, radius, spacing } from '@/constants/theme';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useLocationProfile } from '@/hooks/useLocationProfile';
import { usePreferencesStore } from '@/store/preferencesStore';
import { CurrencyCode } from '@/types';
import { formatTimestamp } from '@/utils/date';

const DEFAULT_AMOUNT = '100';

export default function ConverterScreen() {
  const router = useRouter();
  const homeCurrency = usePreferencesStore((state) => state.homeCurrency);
  const { resolution } = useLocationProfile();
  const detectedLocalCurrency = resolution?.profile.currency ?? homeCurrency;

  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>(homeCurrency);
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(detectedLocalCurrency);

  useEffect(() => {
    setFromCurrency(homeCurrency);
  }, [homeCurrency]);

  useEffect(() => {
    setToCurrency(detectedLocalCurrency);
  }, [detectedLocalCurrency]);

  const { error, loading, rateData, refresh } = useExchangeRate(fromCurrency, toCurrency);

  const numericAmount = Number.parseFloat(amount);
  const sanitizedAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
  const convertedAmount = rateData ? sanitizedAmount * rateData.rate : 0;

  const fromMeta = currencyOptions.find((option) => option.code === fromCurrency);
  const toMeta = currencyOptions.find((option) => option.code === toCurrency);

  const helperText = useMemo(() => {
    if (error) {
      return error;
    }

    if (loading) {
      return 'Fetching the latest available exchange rate.';
    }

    if (!rateData) {
      return 'No exchange rate data is available yet.';
    }

    return `1 ${rateData.baseCurrency} = ${formatNumber(rateData.rate)} ${rateData.targetCurrency}`;
  }, [error, loading, rateData]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Currency converter</Text>
        </View>
        <Text style={styles.heroTitle}>Convert spending into local money fast.</Text>
        <Text style={styles.heroSubtitle}>
          TravelMate starts with your home currency and the currency near your current location, but
          you can switch either one any time.
        </Text>
      </View>

      <DashboardCard
        eyebrow="Live conversion"
        title="Amount to convert"
        description="Type an amount, adjust the currencies, or swap directions for the reverse rate."
        accessory={
          <Pressable onPress={refresh} style={styles.refreshButton}>
            <Text style={styles.refreshText}>{loading ? '...' : 'Refresh'}</Text>
          </Pressable>
        }
      >
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Amount</Text>
          <View style={styles.amountInputWrap}>
            <Text style={styles.amountPrefix}>{fromMeta?.symbol ?? fromCurrency}</Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              style={styles.amountInput}
              value={amount}
            />
          </View>
        </View>

        <View style={styles.selectorGrid}>
          <View style={styles.selectorBlock}>
            <Text style={styles.inputLabel}>From</Text>
            <PickerField
              selectedValue={fromCurrency}
              onValueChange={(value) => setFromCurrency(value as CurrencyCode)}
              items={currencyOptions.map((option) => ({
                label: `${option.label} (${option.code})`,
                value: option.code,
              }))}
            />
          </View>

          <Pressable onPress={handleSwap} style={styles.swapButton}>
            <Text style={styles.swapText}>Swap</Text>
          </Pressable>

          <View style={styles.selectorBlock}>
            <Text style={styles.inputLabel}>To</Text>
            <PickerField
              selectedValue={toCurrency}
              onValueChange={(value) => setToCurrency(value as CurrencyCode)}
              items={currencyOptions.map((option) => ({
                label: `${option.label} (${option.code})`,
                value: option.code,
              }))}
            />
          </View>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Converted amount</Text>
          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={colors.accent} />
              <Text style={styles.loadingText}>Updating exchange rate...</Text>
            </View>
          ) : (
            <Text style={styles.resultValue}>
              {toMeta?.symbol ?? toCurrency} {formatNumber(convertedAmount)}
            </Text>
          )}
          <Text style={styles.resultHelper}>{helperText}</Text>
          <Text style={styles.resultTimestamp}>
            {rateData ? `Last updated ${formatTimestamp(rateData.updatedAt)}` : 'Waiting for rate data'}
          </Text>
        </View>
      </DashboardCard>

      <DashboardCard
        eyebrow="Travel shortcut"
        title="Default route"
        description="This screen is preloaded to convert from your saved home currency into the local currency detected on the dashboard."
      >
        <View style={styles.profileGrid}>
          <ProfileRow label="Home currency" value={getCurrencyLabel(homeCurrency)} />
          <ProfileRow label="Detected local currency" value={getCurrencyLabel(detectedLocalCurrency)} />
          <ProfileRow
            label="Fallback behavior"
            value="Uses cached or mock exchange data if API keys are missing"
          />
        </View>
      </DashboardCard>

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to dashboard</Text>
      </Pressable>
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.md,
  },
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
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
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
  refreshText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  inputBlock: {
    gap: spacing.sm,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardDark,
    paddingHorizontal: spacing.md,
  },
  amountPrefix: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '700',
  },
  amountInput: {
    flex: 1,
    minHeight: 58,
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    paddingLeft: spacing.sm,
  },
  selectorGrid: {
    gap: spacing.md,
  },
  selectorBlock: {
    gap: spacing.sm,
  },
  swapButton: {
    alignSelf: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  swapText: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '800',
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  resultLabel: {
    color: '#5d7287',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  resultValue: {
    color: colors.textDark,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  resultHelper: {
    color: '#48627a',
    fontSize: 14,
    lineHeight: 20,
  },
  resultTimestamp: {
    color: '#6c8297',
    fontSize: 12,
    lineHeight: 18,
  },
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: '#48627a',
    fontSize: 14,
    lineHeight: 20,
  },
  profileGrid: {
    gap: spacing.sm,
  },
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
  profileLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  profileValue: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  backButton: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    minHeight: 54,
    justifyContent: 'center',
  },
  backButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
