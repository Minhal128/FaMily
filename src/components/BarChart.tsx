import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, font, money, radius, shadow, spacing } from '../theme';

export type Series = { label: string; color: string };
export type Group = { label: string; values: number[] };

type Props = {
  series: Series[];
  data: Group[];
  height?: number;
  /** Set both to make bars tappable and show a value bubble over the active one. */
  activeIndex?: number;
  onSelect?: (index: number) => void;
};

/**
 * Grouped bar chart drawn with plain Views.
 * ponytail: no chart lib — bars are boxes with a height. Swap for gifted-charts
 * only if you need axes, tooltips or animation.
 */
export default function BarChart({ series, data, height = 160, activeIndex, onSelect }: Props) {
  const max = Math.max(1, ...data.flatMap((g) => g.values));
  const scroll = data.length > 6;
  const hasFocus = activeIndex !== undefined;

  const plot = (
    <View style={[styles.plot, scroll && { paddingRight: spacing(4) }]}>
      {data.map((group, groupIndex) => {
        const active = activeIndex === groupIndex;
        return (
          <Pressable
            key={`${group.label}-${groupIndex}`}
            onPress={onSelect ? () => onSelect(groupIndex) : undefined}
            style={[styles.group, scroll && { width: 64 }]}
          >
            {active ? (
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>
                  {money(group.values.reduce((t, v) => t + v, 0))}
                </Text>
              </View>
            ) : null}

            <View style={[styles.bars, { height }]}>
              {group.values.map((value, i) => (
                <View
                  key={series[i].label}
                  style={[
                    styles.bar,
                    {
                      height: Math.max(3, (value / max) * height),
                      backgroundColor: series[i].color,
                      // Dim the rest so the selected bar reads as the subject.
                      opacity: hasFocus && !active ? 0.32 : 1,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.groupLabel, active && styles.groupLabelActive]}>
              {group.label}
            </Text>
          </Pressable>
        );
      })}
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
  groupLabelActive: { fontFamily: font.bold, color: colors.primaryDark },
  bubble: {
    position: 'absolute',
    alignSelf: 'center',
    top: -14,
    zIndex: 5,
    paddingHorizontal: spacing(2.5),
    paddingVertical: spacing(1.5),
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    ...shadow,
    shadowOpacity: 0.16,
    elevation: 8,
  },
  bubbleText: { fontFamily: font.semibold, fontSize: 11, color: colors.text },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(4) },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: font.regular, fontSize: 12, color: colors.text },
});
