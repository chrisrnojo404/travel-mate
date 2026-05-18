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
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Soon</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  tilePressed: {
    opacity: 0.92,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(25, 194, 160, 0.16)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
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
});
