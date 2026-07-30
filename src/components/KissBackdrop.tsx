import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/** Deterministic pseudo-random: the kisses scatter arbitrarily but never move between renders. */
const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const pct = (n: number) => `${Math.round(n)}%` as `${number}%`;

/** Weighted on purpose — 💋 repeats so kisses stay the motif and the rest is seasoning. */
const GLYPHS = ['💋', '💋', '💋', '💋', '❤️', '💘', '💕', '🔥', '😘', '💞'];

const KISSES = Array.from({ length: 53 }, (_, i) => ({
  glyph: GLYPHS[Math.floor(rand(i * 19 + 6) * GLYPHS.length)],
  left: pct(rand(i * 3 + 1) * 93),
  top: pct(rand(i * 7 + 2) * 98),
  fontSize: 12 + rand(i * 11 + 3) * 34,
  opacity: 0.1 + rand(i * 13 + 4) * 0.18,
  rotate: `${Math.round((rand(i * 17 + 5) - 0.5) * 110)}deg`,
}));

/** 💋 wallpaper. Sits behind everything and eats no touches. */
export default function KissBackdrop() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {KISSES.map((kiss, i) => (
        <Text
          key={i}
          style={{
            position: 'absolute',
            left: kiss.left,
            top: kiss.top,
            fontSize: kiss.fontSize,
            opacity: kiss.opacity,
            transform: [{ rotate: kiss.rotate }],
          }}
        >
          {kiss.glyph}
        </Text>
      ))}
    </View>
  );
}
