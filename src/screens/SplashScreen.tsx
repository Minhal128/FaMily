import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import KissBackdrop from '../components/KissBackdrop';
import Wordmark from '../components/Wordmark';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(
      () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
      2000
    );
    return () => clearTimeout(timer);
  }, [enter, navigation]);

  return (
    <GradientBackground style={styles.center}>
      <StatusBar style="light" />
      <KissBackdrop />
      <Animated.View
        style={{
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
          ],
        }}
      >
        <Wordmark size={Math.min(72, width * 0.19)} />
      </Animated.View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
