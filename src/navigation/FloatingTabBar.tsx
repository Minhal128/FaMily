import { Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing } from '../theme';
import { TabParamList } from './types';

const icons: Record<keyof TabParamList, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Graph: 'bar-chart-2',
  Chat: 'message-circle',
  Profile: 'users',
  Logout: 'log-out',
};

export default function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { bottom: insets.bottom + spacing(3) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const isLogout = route.name === 'Logout';

        const onPress = () => {
          if (isLogout) {
            navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] });
            return;
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={({ pressed }) => [styles.tab, pressed && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={route.name}
          >
            <Feather
              name={icons[route.name as keyof TabParamList]}
              size={22}
              color={isLogout ? colors.danger : focused ? colors.primaryDark : colors.muted}
            />
            <View style={[styles.dot, focused && styles.dotActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing(5),
    right: spacing(5),
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: spacing(3),
    ...shadow,
    shadowOpacity: 0.14,
    elevation: 12,
  },
  tab: { flex: 1, alignItems: 'center', gap: spacing(1.5) },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'transparent' },
  dotActive: { backgroundColor: colors.primaryDark },
});
