import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
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

export default function Screen({ children, scroll, tabBarSpace = true, style }: Props) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + spacing(2),
    paddingBottom: tabBarSpace ? TAB_BAR_SPACE : insets.bottom + spacing(4),
  };

  if (scroll) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.content, padding, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.root, styles.content, padding, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing(5), gap: spacing(4) },
});
