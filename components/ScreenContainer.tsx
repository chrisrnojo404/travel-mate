import { PropsWithChildren, useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';

interface ScreenContainerProps extends PropsWithChildren {
  backgroundColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showBackdrop?: boolean;
}

export function ScreenContainer({
  backgroundColor = colors.background,
  children,
  contentContainerStyle,
  showBackdrop = true,
}: ScreenContainerProps) {
  const drift = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    );

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 4200,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 4200,
          useNativeDriver: true,
        }),
      ])
    );

    driftLoop.start();
    floatLoop.start();

    return () => {
      driftLoop.stop();
      floatLoop.stop();
    };
  }, [drift, float]);

  const orbLargeAnimatedStyle = {
    transform: [
      {
        translateX: drift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -14],
        }),
      },
      {
        translateY: drift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 10],
        }),
      },
    ],
  };

  const orbSmallAnimatedStyle = {
    transform: [
      {
        translateX: float.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 12],
        }),
      },
      {
        translateY: float.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  const routeChipAnimatedStyle = {
    transform: [
      {
        translateY: float.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
      {
        rotate: drift.interpolate({
          inputRange: [0, 1],
          outputRange: ['-2deg', '2deg'],
        }),
      },
    ],
    opacity: drift.interpolate({
      inputRange: [0, 1],
      outputRange: [0.86, 1],
    }),
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      {showBackdrop ? (
        <View pointerEvents="none" style={styles.backdrop}>
          <Animated.View style={[styles.orbLarge, orbLargeAnimatedStyle]} />
          <Animated.View style={[styles.orbSmall, orbSmallAnimatedStyle]} />
          <Animated.View style={[styles.routeChip, routeChipAnimatedStyle]}>
            <MaterialCommunityIcons color={colors.accentStrong} name="airplane" size={16} />
            <Text style={styles.routeChipText}>Travel mode</Text>
          </Animated.View>
          <Animated.View style={[styles.stampChip, orbSmallAnimatedStyle]}>
            <MaterialCommunityIcons
              color={colors.accentStrong}
              name="ticket-confirmation-outline"
              size={18}
            />
          </Animated.View>
        </View>
      ) : null}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  orbLarge: {
    position: 'absolute',
    top: -24,
    right: -12,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(43, 182, 115, 0.11)',
  },
  orbSmall: {
    position: 'absolute',
    top: 210,
    left: -30,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255, 196, 96, 0.14)',
  },
  routeChip: {
    position: 'absolute',
    top: 92,
    right: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(43, 182, 115, 0.22)',
    backgroundColor: 'rgba(255, 253, 247, 0.88)',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    shadowColor: '#7c8f80',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  routeChipText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  stampChip: {
    position: 'absolute',
    top: 300,
    right: 28,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(21, 135, 90, 0.14)',
    backgroundColor: 'rgba(255, 253, 247, 0.82)',
    shadowColor: '#7c8f80',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  inner: {
    flex: 1,
    gap: spacing.lg,
  },
});
