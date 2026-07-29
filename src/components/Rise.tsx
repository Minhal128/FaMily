import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  /** Position in a list — each item springs in 60ms after the one before it. */
  index?: number;
  style?: StyleProp<ViewStyle>;
};

/** Springs its child up into place. Used for list rows and cards. */
export default function Rise({ children, index = 0, style }: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      delay: 60 + index * 60,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) },
            { scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
