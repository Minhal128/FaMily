import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { brandGradient, colors, font, radius, shadow, spacing } from '../theme';
import GradientBackground from './GradientBackground';

type Variant = 'primary' | 'light' | 'outline';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Button({ title, onPress, variant = 'primary', icon, style }: Props) {
  const body = (
    <View style={styles.row}>
      {icon}
      <Text style={[styles.label, variant === 'primary' ? styles.labelOnDark : styles.labelOnLight]}>
        {title}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && styles.pressed, style]}
    >
      {variant === 'primary' ? (
        <GradientBackground colors={brandGradient} style={styles.fill}>
          {body}
        </GradientBackground>
      ) : (
        <View style={[styles.fill, variant === 'light' ? styles.light : styles.outline]}>{body}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow,
    shadowOpacity: 0.06,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  fill: {
    minHeight: spacing(13),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(4),
  },
  light: { backgroundColor: colors.surface },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing(2) },
  label: { fontFamily: font.semibold, fontSize: 15 },
  labelOnDark: { color: colors.surface },
  labelOnLight: { color: colors.text },
});
