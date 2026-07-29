import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, font, money, radius, spacing } from '../theme';

export type Series = { label: string; color: string };
export type Group = { label: string; values: number[] };

type Props = {
  series: Series[];
  data: Group[];
  height?: number;
};

/**
 * Grouped bar chart drawn with plain Views.
 * ponytail: no chart lib — bars are boxes with a height. Swap for gifted-charts
 * only if you need axes, tooltips or animation.
 */
export default function BarChart({ series, data, height = 160 }: Props) {
  const max = Math.max(1, ...data.flatMap((g) => g.values));
  const scroll = data.length > 6;

  const plot = (
    <View style={[styles.plot, scroll && { paddingRight: spacing(4) }]}>
      {data.map((group, groupIndex) => (
        <View key={`${group.label}-${groupIndex}`} style={[styles.group, scroll && { width: 64 }]}>
          <View style={[styles.bars, { height }]}>
            {group.values.map((value, i) => (
              <View
                key={series[i].label}
                style={[
                  styles.bar,
                  {
                    height: Math.max(3, (value / max) * height),
                    backgroundColor: series[i].color,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.groupLabel}>{group.label}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.max}>peak {money(max)}</Text>
      {scroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {plot}
        </ScrollView>
      ) : (
        plot
      )}
      {series.length > 1 ? (
        <View style={styles.legend}>
          {series.map((s) => (
            <View key={s.label} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <Text style={styles.legendText}>{s.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing(3) },
  max: { fontFamily: font.regular, fontSize: 11, color: colors.muted },
  // paddingTop leaves room for the value bubble to sit above the tallest bar.
  plot: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing(3), paddingTop: spacing(5) },
  group: { flex: 1, alignItems: 'center', gap: spacing(2) },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, width: '100%' },
  bar: { flex: 1, borderRadius: radius.sm, minWidth: 6 },
  groupLabel: { fontFamily: font.medium, fontSize: 11, color: colors.muted },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(4) },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: font.regular, fontSize: 12, color: colors.text },
});
