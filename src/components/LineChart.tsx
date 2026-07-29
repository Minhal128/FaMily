import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, money, radius, shadow, spacing } from '../theme';

export type Point = { label: string; value: number };

type Props = {
  data: Point[];
  color: string;
  height?: number;
  activeIndex?: number;
  onSelect?: (index: number) => void;
};

const DOT = 10;
const STROKE = 3;
const BUBBLE = 96;

/**
 * Line chart drawn without react-native-svg: each segment is a thin View rotated to
 * the angle between two points. Costs nothing to install and needs no rebuild.
 */
export default function LineChart({ data, color, height = 150, activeIndex, onSelect }: Props) {
  const [width, setWidth] = useState(0);

  const max = Math.max(1, ...data.map((p) => p.value));
  const step = data.length > 1 ? width / (data.length - 1) : 0;
  const xOf = (index: number) => index * step;
  const yOf = (value: number) => height - (value / max) * height;

  const ready = width > 0 && data.length > 0;
  const active = activeIndex !== undefined ? data[activeIndex] : undefined;

  return (
    <View style={styles.wrap}>
      <Text style={styles.peak}>peak {money(max)}</Text>

      <View
        style={[styles.plot, { height }]}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {ready &&
          data.slice(0, -1).map((point, i) => {
            const dx = xOf(i + 1) - xOf(i);
            const dy = yOf(data[i + 1].value) - yOf(point.value);
            return (
              <View
                key={`segment-${i}`}
                style={[
                  styles.segment,
                  {
                    left: xOf(i),
                    top: yOf(point.value) - STROKE / 2,
                    width: Math.hypot(dx, dy),
                    backgroundColor: color,
                    transform: [{ rotateZ: `${Math.atan2(dy, dx)}rad` }],
                  },
                ]}
              />
            );
          })}

        {ready && activeIndex !== undefined && (
          <View
            style={[
              styles.guide,
              { left: xOf(activeIndex), top: yOf(data[activeIndex].value), backgroundColor: color },
            ]}
          />
        )}

        {ready &&
          data.map((point, i) => (
            <View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  left: xOf(i) - DOT / 2,
                  top: yOf(point.value) - DOT / 2,
                  borderColor: color,
                },
                activeIndex === i && styles.dotActive,
              ]}
            />
          ))}

        {ready && active && activeIndex !== undefined && (
          <View
            style={[
              styles.bubble,
              {
                // Kept inside the plot so the value never runs off an edge.
                left: Math.min(Math.max(xOf(activeIndex) - BUBBLE / 2, 0), Math.max(width - BUBBLE, 0)),
                top: Math.max(yOf(active.value) - 40, -6),
              },
            ]}
          >
            <Text style={[styles.bubbleText, { color }]}>{money(active.value)}</Text>
          </View>
        )}

        {onSelect ? (
          <View style={styles.touchRow}>
            {data.map((point, i) => (
              <Pressable
                key={`hit-${point.label}-${i}`}
                onPress={() => onSelect(i)}
                style={styles.hit}
                accessibilityLabel={`${point.label}: ${money(point.value)}`}
              />
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.labels}>
        {data.map((point, i) => (
          <Text
            key={`label-${point.label}-${i}`}
            style={[styles.label, activeIndex === i && styles.labelActive]}
          >
            {point.label}
          </Text>
        ))}
      </View>
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
  guide: { position: 'absolute', width: 1, bottom: 0, opacity: 0.35 },
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
    width: BUBBLE,
    alignItems: 'center',
    paddingVertical: spacing(1.5),
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    ...shadow,
    shadowOpacity: 0.16,
    elevation: 8,
  },
  bubbleText: { fontFamily: font.semibold, fontSize: 12 },
  touchRow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row' },
  hit: { flex: 1 },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontFamily: font.medium, fontSize: 11, color: colors.muted },
  labelActive: { fontFamily: font.bold, color: colors.primaryDark },
});
