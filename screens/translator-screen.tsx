import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

import { DashboardCard } from '@/components/DashboardCard';
import { PickerField } from '@/components/PickerField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { languageOptions } from '@/constants/options';
import { colors, radius, spacing } from '@/constants/theme';
import { useLocationProfile } from '@/hooks/useLocationProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { usePreferencesStore } from '@/store/preferencesStore';
import { LanguageCode } from '@/types';

const DEFAULT_TEXT = 'Where is the bathroom?';

export default function TranslatorScreen() {
  const preferredLanguage = usePreferencesStore((state) => state.preferredLanguage);
  const { resolution } = useLocationProfile();
  const detectedLocalLanguage = resolution?.profile.language ?? preferredLanguage;

  const [sourceLanguage, setSourceLanguage] = useState<LanguageCode>(preferredLanguage);
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(detectedLocalLanguage);
  const [inputText, setInputText] = useState(DEFAULT_TEXT);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [speechActive, setSpeechActive] = useState(false);

  const { error, loading, result, runTranslation } = useTranslation();

  useEffect(() => {
    setSourceLanguage(preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    setTargetLanguage(detectedLocalLanguage);
  }, [detectedLocalLanguage]);

  const targetLanguageLabel = getLanguageLabel(targetLanguage);
  const sourceLanguageLabel = getLanguageLabel(sourceLanguage);

  const helperText = useMemo(() => {
    if (error) {
      return error;
    }
    if (result) {
      return `Translated from ${getLanguageLabel(result.sourceLanguage)} into ${getLanguageLabel(result.targetLanguage)} using ${result.provider === 'api' ? 'a live API' : 'mock fallback'} data.`;
    }
    return `Translate from ${sourceLanguageLabel} into ${targetLanguageLabel}.`;
  }, [error, result, sourceLanguageLabel, targetLanguageLabel]);

  const handleTranslate = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText) {
      setCopyFeedback(null);
      Alert.alert('Add some text', 'Enter a phrase or sentence before translating.');
      return;
    }
    setCopyFeedback(null);
    await runTranslation(trimmedText, sourceLanguage, targetLanguage);
  };

  const handleCopy = async () => {
    if (!result?.translatedText) return;
    await Clipboard.setStringAsync(result.translatedText);
    setCopyFeedback('Copied to clipboard');
  };

  const handleSpeak = async () => {
    if (!result?.translatedText) return;
    try {
      setSpeechActive(true);
      await Speech.stop();
      Speech.speak(result.translatedText, {
        language: targetLanguage,
        onDone: () => setSpeechActive(false),
        onStopped: () => setSpeechActive(false),
        onError: () => setSpeechActive(false),
      });
    } catch {
      setSpeechActive(false);
      Alert.alert('Speech unavailable', 'Text-to-speech could not start on this device.');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Translator</Text>
        </View>
        <Text style={styles.heroTitle}>Say the right thing without slowing down.</Text>
        <Text style={styles.heroSubtitle}>
          Translate from your preferred language into the local language around you, then copy or
          speak it instantly.
        </Text>
      </View>

      <DashboardCard
        eyebrow="Translation input"
        title="What do you want to say?"
        description="You can change the source and destination languages manually whenever you need to."
      >
        <View style={styles.selectorGrid}>
          <View style={styles.selectorBlock}>
            <Text style={styles.inputLabel}>From</Text>
            <PickerField
              selectedValue={sourceLanguage}
              onValueChange={(value) => setSourceLanguage(value as LanguageCode)}
              items={languageOptions.map((option) => ({
                label: option.label,
                value: option.code,
              }))}
            />
          </View>

          <View style={styles.selectorBlock}>
            <Text style={styles.inputLabel}>To</Text>
            <PickerField
              selectedValue={targetLanguage}
              onValueChange={(value) => setTargetLanguage(value as LanguageCode)}
              items={languageOptions.map((option) => ({
                label: option.label,
                value: option.code,
              }))}
            />
          </View>
        </View>

        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Text to translate</Text>
          <TextInput
            multiline
            onChangeText={setInputText}
            placeholder="Type a travel phrase or question..."
            placeholderTextColor={colors.textSecondary}
            style={styles.textInput}
            textAlignVertical="top"
            value={inputText}
          />
        </View>

        <PrimaryButton label={loading ? 'Translating...' : 'Translate text'} onPress={handleTranslate} loading={loading} />
      </DashboardCard>

      <DashboardCard
        eyebrow="Translation result"
        title={result ? 'Ready to use' : 'Your translated text will appear here'}
        description={helperText}
      >
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Generating your translation...</Text>
          </View>
        ) : result ? (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>In {targetLanguageLabel}</Text>
              <Text style={styles.resultValue}>{result.translatedText}</Text>
            </View>

            <View style={styles.actionRow}>
              <Pressable onPress={handleCopy} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Copy</Text>
              </Pressable>
              <Pressable onPress={handleSpeak} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>{speechActive ? 'Speaking...' : 'Speak aloud'}</Text>
              </Pressable>
            </View>

            {copyFeedback ? <Text style={styles.feedbackText}>{copyFeedback}</Text> : null}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No translation yet</Text>
            <Text style={styles.emptyText}>
              Start with a quick travel question, then tap Translate text.
            </Text>
          </View>
        )}
      </DashboardCard>

      <DashboardCard
        eyebrow="Travel context"
        title="Current language route"
        description="TravelMate preloads the translator from your saved preferred language into the local language detected from your current trip profile."
      >
        <View style={styles.profileGrid}>
          <ProfileRow label="Preferred language" value={sourceLanguageLabel} />
          <ProfileRow label="Detected local language" value={targetLanguageLabel} />
          <ProfileRow label="Speech support" value="Uses Expo Speech when your device supports the selected voice" />
        </View>
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
  selectorGrid: { gap: spacing.md },
  selectorBlock: { gap: spacing.sm },
  inputBlock: { gap: spacing.sm },
  inputLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  textInput: {
    minHeight: 150,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardDark,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  loadingState: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  loadingText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  resultCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm },
  resultLabel: { color: '#5d7287', fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  resultValue: { color: colors.textDark, fontSize: 26, fontWeight: '800', lineHeight: 34 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  secondaryButton: {
    flexGrow: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  feedbackText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  emptyState: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  emptyText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
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
});
