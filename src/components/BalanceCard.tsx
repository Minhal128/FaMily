import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { revealLines } from '../lib/format';
import { useApp } from '../state/AppContext';
import { brandGradientReverse, colors, font, money, radius, shadow, spacing } from '../theme';
import GradientBackground from './GradientBackground';
import Wordmark from './Wordmark';

const FLIP_MS = 600;
/** Let the card land before the message starts writing itself. */
const TYPE_START_MS = 340;
const TYPE_STEP_MS = 55;

export default function BalanceCard() {
  const { profile, partner, balance, totalEarning, totalExpense } = useApp();
  const [flipped, setFlipped] = useState(false);
  const [shown, setShown] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;

  // Two explicit lines rather than one wrapping string: Pacifico's descenders get
  // clipped when a second line has to fit inside the card's fixed height, which ate
  // the closing name. Each line is short enough that it can never wrap.
  const lines = [`${partner.name} loves you,`, profile.name];
  const message = lines.join(' ');

  const flip = () => {
    const next = !flipped;
    setFlipped(next);
    Animated.timing(spin, {
      toValue: next ? 1 : 0,
      duration: FLIP_MS,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  // PanResponder is built once, so it reaches `flip` through a ref that stays current.
  const flipRef = useRef(flip);
  flipRef.current = flip;

  // Horizontal swipe flips too; vertical drags stay with the scroll view.
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 18 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 40) flipRef.current();
      },
    })
  ).current;

  // Reveal is derived from elapsed time, not from a tick count: a dropped or late
  // tick catches up instead of leaving the last few letters unwritten.
  const length = message.length;
  useEffect(() => {
    if (!flipped) {
      setShown(0);
      return;
    }
    const began = Date.now();
    const typer = setInterval(() => {
      const chars = Math.floor((Date.now() - began - TYPE_START_MS) / TYPE_STEP_MS);
      if (chars >= length) {
        setShown(length);
        clearInterval(typer);
      } else if (chars > 0) {
        setShown(chars);
      }
    }, TYPE_STEP_MS);

    return () => clearInterval(typer);
  }, [flipped, length]);

  const rotate = (from: string, to: string) =>
    spin.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

  const frontStyle = {
    opacity: spin.interpolate({ inputRange: [0, 0.5, 0.501, 1], outputRange: [1, 1, 0, 0] }),
    transform: [{ perspective: 1000 }, { rotateY: rotate('0deg', '180deg') }],
  };
  const backStyle = {
    opacity: spin.interpolate({ inputRange: [0, 0.499, 0.5, 1], outputRange: [0, 0, 1, 1] }),
    transform: [{ perspective: 1000 }, { rotateY: rotate('180deg', '360deg') }],
  };

  return (
    <View {...pan.panHandlers}>
      <Pressable onPress={flip} accessibilityLabel="Flip balance card">
        <Animated.View style={[styles.face, frontStyle]}>
          <GradientBackground style={styles.inner}>
            <View style={styles.top}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Total Balance</Text>
                <Feather name="chevron-up" size={14} color="rgba(255,255,255,0.9)" />
              </View>
              <Wordmark size={18} />
            </View>

            <Text style={styles.amount}>{money(balance)}</Text>

            <View style={styles.split}>
              {[
                { icon: 'arrow-down', label: 'Income', value: totalEarning },
                { icon: 'arrow-up', label: 'Expenses', value: totalExpense },
              ].map((item) => (
                <View key={item.label} style={styles.splitItem}>
                  <View style={styles.splitTop}>
                    <View style={styles.splitIcon}>
                      <Feather
                        name={item.icon as keyof typeof Feather.glyphMap}
                        size={11}
                        color={colors.surface}
                      />
                    </View>
                    <Text style={styles.splitLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.splitValue}>{money(item.value)}</Text>
                </View>
              ))}
            </View>
          </GradientBackground>
        </Animated.View>

        <Animated.View style={[styles.face, styles.back, backStyle]}>
          <GradientBackground colors={brandGradientReverse} style={[styles.inner, styles.backInner]}>
            <Feather name="heart" size={20} color="rgba(255,255,255,0.9)" />
            <View style={styles.lines}>
              {revealLines(lines, shown).map((text, i) => (
                <Text key={lines[i]} style={styles.note}>
                  {text}
                </Text>
              ))}
            </View>
            <Text style={styles.hint}>tap to flip back</Text>
          </GradientBackground>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Rounding lives on each face, not the wrapper — a clipped parent mangles the rotation.
  // minHeight guarantees the back has room for a two-line message.
  face: { minHeight: 214, borderRadius: radius.lg, overflow: 'hidden', ...shadow, shadowOpacity: 0.18 },
  back: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  inner: { padding: spacing(5), paddingBottom: spacing(11), gap: spacing(3) },
  // Less bottom padding than the front: the circles only overlap the very edge.
  backInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(3),
    paddingBottom: spacing(9),
  },

  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  label: { fontFamily: font.medium, fontSize: 14, color: 'rgba(255,255,255,0.92)' },
  amount: { fontFamily: font.bold, fontSize: 34, color: colors.surface },

  split: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.md,
    padding: spacing(4),
  },
  splitItem: { flex: 1, gap: spacing(1.5) },
  splitTop: { flexDirection: 'row', alignItems: 'center', gap: spacing(2) },
  splitIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitLabel: { fontFamily: font.regular, fontSize: 13, color: 'rgba(255,255,255,0.92)' },
  splitValue: { fontFamily: font.semibold, fontSize: 17, color: colors.surface },

  lines: { alignItems: 'center' },
  note: {
    fontFamily: font.brand,
    fontSize: 24,
    // No fixed lineHeight — a script face clips against one on Android.
    color: colors.surface,
    textAlign: 'center',
    paddingHorizontal: spacing(2),
  },
  hint: { fontFamily: font.regular, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
});
