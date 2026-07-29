import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

/** Room left below content so the floating tab bar never covers it. */
export const TAB_BAR_SPACE = 108;

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  /** Set false on screens rendered as a modal (no floating tab bar there). */
  tabBarSpace?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Every screen fades and rises on mount, so navigation always lands softly.
 * ponytail: animating the container itself keeps children's flex/gap untouched —
 * wrapping them in an extra Animated.View would collapse the layout gaps.
 */
export default function Screen({ children, scroll, tabBarSpace = true, style }: Props) {
  const insets = useSafeAreaInsets();
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const motion = {
    opacity: enter,
    transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
  };

  const padding = {
    paddingTop: insets.top + spacing(2),
    paddingBottom: tabBarSpace ? TAB_BAR_SPACE : insets.bottom + spacing(4),
  };

  if (scroll) {
    return (
      <Animated.ScrollView
        style={[styles.root, motion]}
        contentContainerStyle={[styles.content, padding, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Animated.ScrollView>
    );
  }

  return (
    <Animated.View style={[styles.root, styles.content, padding, style, motion]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing(5), gap: spacing(4) },
});
