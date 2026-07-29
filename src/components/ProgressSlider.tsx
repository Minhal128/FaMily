import React, { useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, shadow, spacing } from '../theme';
import GradientBackground from './GradientBackground';

type Props = {
  label: string;
  /** 0 to 1. */
  value: number;
  onChange: (value: number) => void;
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Drag-to-set progress bar.
 * ponytail: PanResponder + two Views — @react-native-community/slider is a native
 * module and would cost a rebuild for one control.
 */
export default function ProgressSlider({ label, value, onChange }: Props) {
  const [width, setWidth] = useState(0);

  // The responder is built once, so live values reach it through refs.
  const widthRef = useRef(0);
  const valueRef = useRef(value);
  const changeRef = useRef(onChange);
  const startRef = useRef(value);
  widthRef.current = width;
  valueRef.current = value;
  changeRef.current = onChange;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startRef.current = valueRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        if (widthRef.current <= 0) return;
        const next = clamp(startRef.current + gesture.dx / widthRef.current);
        changeRef.current(Math.round(next * 100) / 100);
      },
    })
  ).current;

  const percent = Math.round(value * 100);

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>

      <View
        style={styles.track}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        {...pan.panHandlers}
      >
        <View style={styles.rail} />
        <View style={[styles.fill, { width: `${percent}%` }]}>
          <GradientBackground />
        </View>
        <View style={[styles.knob, { left: `${percent}%` }]} />
      </View>
    </View>
  );
}

const KNOB = 24;

const styles = StyleSheet.create({
  wrap: { gap: spacing(2) },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: {
    fontFamily: font.medium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  percent: { fontFamily: font.bold, fontSize: 15, color: colors.primaryDark },
  track: {
    height: KNOB,
    justifyContent: 'center',
  },
  rail: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  knob: {
    position: 'absolute',
    marginLeft: -KNOB / 2,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.primaryDark,
    ...shadow,
    shadowOpacity: 0.16,
    elevation: 6,
  },
});
