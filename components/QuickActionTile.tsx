import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

interface QuickActionTileProps {
  title: string;
  description: string;
  onPress?: () => void;
}

export function QuickActionTile({ title, description, onPress }: QuickActionTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed ? styles.tilePressed : null]}
    >
      <View style={styles.copyBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.cta}>Tap to open</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 150,
    maxWidth: 280,
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 168,
    shadowColor: '#a8b9a8',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  copyBlock: {
    gap: spacing.sm,
  },
  tilePressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  cta: {
    color: colors.accentStrong,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
