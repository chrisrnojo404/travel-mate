import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';

import { DashboardCard } from '@/components/DashboardCard';
import { PickerField } from '@/components/PickerField';
import { ScreenContainer } from '@/components/ScreenContainer';
import { languageOptions } from '@/constants/options';
import { colors, radius, spacing } from '@/constants/theme';
import { baseTravelPhrases } from '@/constants/travelPhrases';
import { useLocationProfile } from '@/hooks/useLocationProfile';
import { translateText } from '@/services/translationService';
import { usePreferencesStore } from '@/store/preferencesStore';
import { LanguageCode } from '@/types';

interface PhraseItem {
  source: string;
  translated: string;
  provider: 'mock' | 'api';
}

export default function PhrasesScreen() {
  const preferredLanguage = usePreferencesStore((state) => state.preferredLanguage);
  const { resolution } = useLocationProfile();
  const detectedLocalLanguage = resolution?.profile.language ?? preferredLanguage;

  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(detectedLocalLanguage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [speakingPhrase, setSpeakingPhrase] = useState<string | null>(null);
  const [phrases, setPhrases] = useState<PhraseItem[]>([]);

  useEffect(() => {
    setTargetLanguage(detectedLocalLanguage);
  }, [detectedLocalLanguage]);

  const loadPhrases = async () => {
    setLoading(true);
    setError(null);
    setCopyFeedback(null);
    try {
      const nextPhrases = await Promise.all(
        baseTravelPhrases.map(async (phrase) => {
          const result = await translateText(phrase, preferredLanguage, targetLanguage);
          return { source: phrase, translated: result.translatedText, provider: result.provider };
        }),
      );
      setPhrases(nextPhrases);
    } catch {
      setError('We could not load travel phrases right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhrases();
  }, [preferredLanguage, targetLanguage]);

  const providerLabel = useMemo(() => {
    if (!phrases.length) return 'Waiting for phrase data';
    return phrases.some((phrase) => phrase.provider === 'api')
      ? 'Using live translation results where available'
      : 'Using mock fallback translations';
  }, [phrases]);

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setCopyFeedback('Phrase copied to clipboard');
  };

  const handleSpeak = async (text: string) => {
    try {
      setSpeakingPhrase(text);
      await Speech.stop();
      Speech.speak(text, {
        language: targetLanguage,
        onDone: () => setSpeakingPhrase(null),
        onStopped: () => setSpeakingPhrase(null),
        onError: () => setSpeakingPhrase(null),
      });
    } catch {
      setSpeakingPhrase(null);
      Alert.alert('Speech unavailable', 'Text-to-speech could not start on this device.');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Travel phrases</Text>
        </View>
        <Text style={styles.heroTitle}>Keep the essential phrases ready.</Text>
        <Text style={styles.heroSubtitle}>
          TravelMate translates common travel phrases into the local language near you so you can
          copy or speak them quickly.
        </Text>
      </View>

      <DashboardCard
        eyebrow="Phrasebook target"
        title="Translate into your current destination language"
        description="The phrasebook defaults to the detected local language, but you can switch it manually whenever you need to."
        accessory={
          <Pressable onPress={loadPhrases} style={styles.refreshButton}>
            <Text style={styles.refreshText}>{loading ? '...' : 'Refresh'}</Text>
          </Pressable>
        }
      >
        <View style={styles.selectorBlock}>
          <Text style={styles.inputLabel}>Target language</Text>
          <PickerField
            selectedValue={targetLanguage}
            onValueChange={(value) => setTargetLanguage(value as LanguageCode)}
            items={languageOptions.map((option) => ({
              label: option.label,
              value: option.code,
            }))}
          />
        </View>
        <Text style={styles.helperText}>{providerLabel}</Text>
      </DashboardCard>

      <DashboardCard
        eyebrow="Essential phrases"
        title={loading ? 'Loading your phrasebook...' : 'Phrasebook ready'}
        description={
          error ??
          `Showing ${baseTravelPhrases.length} common travel phrases translated from ${getLanguageLabel(preferredLanguage)} into ${getLanguageLabel(targetLanguage)}.`
        }
      >
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Preparing translated travel phrases...</Text>
          </View>
        ) : (
          <ScrollView horizontal={false} scrollEnabled={false} contentContainerStyle={styles.phraseList}>
            {phrases.map((phrase) => (
              <View key={phrase.source} style={styles.phraseCard}>
                <Text style={styles.sourceText}>{phrase.source}</Text>
                <Text style={styles.translatedText}>{phrase.translated}</Text>
                <View style={styles.actionRow}>
                  <Pressable onPress={() => handleCopy(phrase.translated)} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Copy</Text>
                  </Pressable>
                  <Pressable onPress={() => handleSpeak(phrase.translated)} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>
                      {speakingPhrase === phrase.translated ? 'Speaking...' : 'Speak aloud'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
        {copyFeedback ? <Text style={styles.feedbackText}>{copyFeedback}</Text> : null}
      </DashboardCard>

      <DashboardCard
        eyebrow="Travel context"
        title="Phrasebook defaults"
        description="These phrases stay aligned with your saved language preferences and your detected trip location."
      >
        <View style={styles.profileGrid}>
          <ProfileRow label="Preferred language" value={getLanguageLabel(preferredLanguage)} />
          <ProfileRow label="Detected local language" value={getLanguageLabel(targetLanguage)} />
          <ProfileRow label="Included phrases" value={`${baseTravelPhrases.length} essentials`} />
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
  selectorBlock: { gap: spacing.sm },
  inputLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  helperText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  loadingState: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  loadingText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  phraseList: { gap: spacing.md },
  phraseCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm },
  sourceText: { color: '#5d7287', fontSize: 13, fontWeight: '700' },
  translatedText: { color: colors.textDark, fontSize: 24, fontWeight: '800', lineHeight: 32 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  secondaryButton: {
    flexGrow: 1,
    minHeight: 46,
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
