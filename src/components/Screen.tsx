import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import KissBackdrop from './KissBackdrop';

/** Room left below content so the floating tab bar never covers it. */
export const TAB_BAR_SPACE = 108;

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  /** Set false on screens rendered as a modal (no floating tab bar there). */
  tabBarSpace?: boolean;
  /** Set false where the 💋 wallpaper would compete with the content. */
  kisses?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Every screen fades and rises on mount, so navigation always lands softly.
 * ponytail: animating the container itself keeps children's flex/gap untouched —
 * wrapping them in an extra Animated.View would collapse the layout gaps.
 */
export default function Screen({
  children,
  scroll,
  tabBarSpace = true,
  kisses = true,
  style,
}: Props) {
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

  // The backdrop is a sibling, not a parent: the scroller stays transparent so the
  // kisses hold still while content scrolls over them.
  return (
    <View style={styles.root}>
      {kisses ? <KissBackdrop /> : null}
      {scroll ? (
        <Animated.ScrollView
          style={[styles.flex, motion]}
          contentContainerStyle={[styles.content, padding, style]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </Animated.ScrollView>
      ) : (
        <Animated.View style={[styles.flex, styles.content, padding, style, motion]}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing(5), gap: spacing(4) },
});
