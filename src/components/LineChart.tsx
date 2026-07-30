import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, money, radius, shadow, spacing } from '../theme';

export type Point = { label: string; value: number };
export type Line = { label: string; color: string; data: Point[] };

type Props = {
  lines: Line[];
  height?: number;
  activeIndex?: number;
  onSelect?: (index: number) => void;
};

const DOT = 10;
const STROKE = 3;
const ROW = 18;

/**
 * Multi-line chart drawn without react-native-svg: each segment is a thin View rotated to
 * the angle between two points. Costs nothing to install and needs no rebuild.
 * All lines share one scale, so they can be compared against each other.
 */
export default function LineChart({ lines, height = 150, activeIndex, onSelect }: Props) {
  const [width, setWidth] = useState(0);

  // Every line is sampled at the same x positions, so the first one owns the labels.
  const points = lines[0]?.data ?? [];
  const max = Math.max(1, ...lines.flatMap((l) => l.data.map((p) => p.value)));
  const step = points.length > 1 ? width / (points.length - 1) : 0;
  const xOf = (index: number) => index * step;
  const yOf = (value: number) => height - (value / max) * height;

  const ready = width > 0 && points.length > 0;
  const active = activeIndex !== undefined && activeIndex < points.length ? activeIndex : undefined;

  const bubbleWidth = lines.length > 1 ? 168 : 96;
  const bubbleHeight = lines.length * ROW + 12;

  return (
    <View style={styles.wrap}>
      <Text style={styles.peak}>peak {money(max)}</Text>

      <View
        style={[styles.plot, { height }]}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {ready && active !== undefined && (
          <View style={[styles.guide, { left: xOf(active) }]} />
        )}

        {ready &&
          lines.map((line) =>
            line.data.slice(0, -1).map((point, i) => {
              const dx = xOf(i + 1) - xOf(i);
              const dy = yOf(line.data[i + 1].value) - yOf(point.value);
              return (
                <View
                  key={`${line.label}-segment-${i}`}
                  style={[
                    styles.segment,
                    {
                      left: xOf(i),
                      top: yOf(point.value) - STROKE / 2,
                      width: Math.hypot(dx, dy),
                      backgroundColor: line.color,
                      transform: [{ rotateZ: `${Math.atan2(dy, dx)}rad` }],
                    },
                  ]}
                />
              );
            })
          )}

        {ready &&
          lines.map((line) =>
            line.data.map((point, i) => (
              <View
                key={`${line.label}-dot-${i}`}
                style={[
                  styles.dot,
                  { left: xOf(i) - DOT / 2, top: yOf(point.value) - DOT / 2, borderColor: line.color },
                  active === i && styles.dotActive,
                ]}
              />
            ))
          )}

        {ready && active !== undefined && (
          <View
            style={[
              styles.bubble,
              {
                width: bubbleWidth,
                // Kept inside the plot so the value never runs off an edge.
                left: Math.min(
                  Math.max(xOf(active) - bubbleWidth / 2, 0),
                  Math.max(width - bubbleWidth, 0)
                ),
                top: Math.max(
                  Math.min(...lines.map((l) => yOf(l.data[active].value))) - bubbleHeight - 8,
                  -spacing(6)
                ),
              },
            ]}
          >
            {lines.map((line) => (
              <View key={`${line.label}-readout`} style={styles.bubbleRow}>
                {lines.length > 1 ? <Text style={styles.bubbleLabel}>{line.label}</Text> : null}
                <Text style={[styles.bubbleText, { color: line.color }]}>
                  {money(line.data[active].value)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {onSelect ? (
          <View style={styles.touchRow}>
            {points.map((point, i) => (
              <Pressable
                key={`hit-${point.label}-${i}`}
                onPress={() => onSelect(i)}
                style={styles.hit}
                accessibilityLabel={`${point.label}: ${lines
                  .map((l) => `${l.label} ${money(l.data[i].value)}`)
                  .join(', ')}`}
              />
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.labels}>
        {points.map((point, i) => (
          <Text
            key={`label-${point.label}-${i}`}
            style={[styles.label, active === i && styles.labelActive]}
          >
            {point.label}
          </Text>
        ))}
      </View>

      {lines.length > 1 ? (
        <View style={styles.legend}>
          {lines.map((line) => (
            <View key={`legend-${line.label}`} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: line.color }]} />
              <Text style={styles.legendText}>{line.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing(3) },
  peak: { fontFamily: font.regular, fontSize: 11, color: colors.muted },
  plot: { marginTop: spacing(6), marginHorizontal: DOT / 2 },
  segment: {
    position: 'absolute',
    height: STROKE,
    borderRadius: STROKE / 2,
    transformOrigin: 'left center',
  },
  guide: { position: 'absolute', width: 1, top: 0, bottom: 0, backgroundColor: colors.muted, opacity: 0.35 },
  dot: {
    position: 'absolute',
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2.5,
    backgroundColor: colors.surface,
  },
  dotActive: { transform: [{ scale: 1.5 }], borderWidth: 3 },
  bubble: {
    position: 'absolute',
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2.5),
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    ...shadow,
    shadowOpacity: 0.16,
    elevation: 8,
  },
  bubbleRow: {
    height: ROW,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing(2),
  },
  bubbleLabel: { fontFamily: font.regular, fontSize: 11, color: colors.muted },
  bubbleText: { fontFamily: font.semibold, fontSize: 12, flexShrink: 1, textAlign: 'right' },
  touchRow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row' },
  hit: { flex: 1 },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontFamily: font.medium, fontSize: 11, color: colors.muted },
  labelActive: { fontFamily: font.bold, color: colors.primaryDark },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(4) },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: font.regular, fontSize: 12, color: colors.text },
});
