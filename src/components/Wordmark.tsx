import React from 'react';
import { Text } from 'react-native';
import { colors, font } from '../theme';

type Props = { size?: number; color?: string };

export default function Wordmark({ size = 48, color = colors.surface }: Props) {
  return (
    <Text style={{ fontFamily: font.brand, fontSize: size, lineHeight: size * 1.4, color }}>
      FaMily
    </Text>
  );
}
