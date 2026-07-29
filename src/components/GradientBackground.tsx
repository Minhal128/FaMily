import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { brandGradient } from '../theme';

type Props = {
  children?: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: StyleProp<ViewStyle>;
};

/** Diagonal gradient fill (top-left -> bottom-right). Defaults to the brand pink/red. */
export default function GradientBackground({ children, colors = brandGradient, style }: Props) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
}
