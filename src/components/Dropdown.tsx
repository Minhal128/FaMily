import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, shadow, spacing } from '../theme';

type Props<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

/** Pill that opens a short list underneath it. */
export default function Dropdown<T extends string>({ value, options, onChange }: Props<T>) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => [styles.pill, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.pillText}>{value}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={15} color={colors.text} />
      </Pressable>

      {open ? (
        <View style={styles.menu}>
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.6 }]}
            >
              <Text style={[styles.itemText, option === value && styles.itemActive]}>{option}</Text>
              {option === value ? (
                <Feather name="check" size={14} color={colors.primaryDark} />
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { zIndex: 20 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2.5),
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  menu: {
    position: 'absolute',
    top: '110%',
    right: 0,
    minWidth: 150,
    borderRadius: radius.md,
    padding: spacing(1),
    backgroundColor: colors.surface,
    ...shadow,
    shadowOpacity: 0.16,
    elevation: 14,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2.5),
    borderRadius: radius.sm,
  },
  itemText: { fontFamily: font.regular, fontSize: 13, color: colors.text },
  itemActive: { fontFamily: font.semibold, color: colors.primaryDark },
});
