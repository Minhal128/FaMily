import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../theme';

type Props<T extends string> = {
  label?: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export default function Segmented<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.track}>
        {options.map((option) => {
          const active = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text style={[styles.text, active && styles.textActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing(2) },
  label: {
    fontFamily: font.medium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  track: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing(1),
    gap: spacing(1),
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing(2.5),
    borderRadius: radius.sm + 2,
  },
  segmentActive: { backgroundColor: colors.primaryDark },
  text: { fontFamily: font.medium, fontSize: 14, color: colors.muted },
  textActive: { color: colors.surface, fontFamily: font.semibold },
});
