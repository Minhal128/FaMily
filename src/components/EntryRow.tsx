import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../theme';

type Props = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  meta: string;
  amount: string;
  amountColor: string;
  tint: string;
};

export default function EntryRow({ icon, title, subtitle, meta, amount, amountColor, tint }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: tint }]}>
        <Feather name={icon} size={17} color={amountColor} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor }]}>{amount}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(3),
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing(3.5),
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
  title: { fontFamily: font.semibold, fontSize: 14, color: colors.text },
  subtitle: { fontFamily: font.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { fontFamily: font.semibold, fontSize: 15 },
  meta: { fontFamily: font.regular, fontSize: 11, color: colors.muted, marginTop: 2 },
});
