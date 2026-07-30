import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import BalanceCard from '../components/BalanceCard';
import EntryRow from '../components/EntryRow';
import Rise from '../components/Rise';
import Screen from '../components/Screen';
import { greeting, relativeDate } from '../lib/format';
import { useApp } from '../state/AppContext';
import { colors, font, money, radius, shadow, spacing } from '../theme';

const CIRCLE = 64;

/** `ring` is the pale edge, `color` the icon and the glow beneath it. */
const ACTIONS = [
  { route: 'AddMoney', label: 'Add Money', icon: 'plus', color: colors.primaryDark, ring: '#FFD8DC' },
  { route: 'Expense', label: 'Expense', icon: 'shopping-bag', color: colors.danger, ring: '#FBD5D0' },
  { route: 'Investment', label: 'Invest', icon: 'trending-up', color: colors.gold, ring: '#F2E3B4' },
  { route: 'Saving', label: 'Saving', icon: 'dollar-sign', color: colors.success, ring: '#C4EFD7' },
] as const;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { profile, incomes, expenses } = useApp();

  const transactions = useMemo(
    () =>
      [
        ...incomes.map((i) => ({ id: i.id, name: i.source, date: i.date, amount: i.amount })),
        ...expenses.map((e) => ({ id: e.id, name: e.name, date: e.date, amount: -e.amount })),
      ]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6),
    [incomes, expenses]
  );

  return (
    <Screen scroll kisses={false}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.name}>{profile.name}</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Chat')}
          style={styles.bell}
          accessibilityLabel="Open notes"
        >
          <Feather name="bell" size={19} color={colors.text} />
          <View style={styles.bellDot} />
        </Pressable>
      </View>

      <BalanceCard />

      <View style={styles.actions}>
        {ACTIONS.map((action, index) => (
          <CircleAction
            key={action.route}
            action={action}
            index={index}
            onPress={() => navigation.navigate(action.route)}
          />
        ))}
      </View>

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Transactions History</Text>
        <Pressable onPress={() => navigation.navigate('Expense')} hitSlop={8}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <View style={styles.history}>
        {transactions.map((t, index) => {
          const income = t.amount > 0;
          return (
            <Rise key={t.id} index={index}>
              <EntryRow
                icon={income ? 'arrow-down-left' : 'arrow-up-right'}
                title={t.name}
                subtitle={relativeDate(t.date)}
                amount={`${income ? '+' : '-'} ${money(t.amount)}`}
                amountColor={income ? colors.success : colors.danger}
                tint={income ? '#E7F8EF' : '#FDECEA'}
              />
            </Rise>
          );
        })}
        {transactions.length === 0 ? (
          <Text style={styles.empty}>No transactions yet.</Text>
        ) : null}
      </View>
    </Screen>
  );
}

/** Circles straddle the card edge and spring in one after another. */
function CircleAction({
  action,
  index,
  onPress,
}: {
  action: (typeof ACTIONS)[number];
  index: number;
  onPress: () => void;
}) {
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, {
      toValue: 1,
      delay: 160 + index * 90,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [pop, index]);

  return (
    <Animated.View style={{ opacity: pop, transform: [{ scale: pop }] }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.action, pressed && { transform: [{ scale: 0.94 }] }]}
        accessibilityLabel={action.label}
      >
        <View style={[styles.circle, { borderColor: action.ring, shadowColor: action.color }]}>
          <Feather name={action.icon} size={23} color={action.color} />
        </View>
        <Text style={styles.actionLabel}>{action.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontFamily: font.regular, fontSize: 13, color: colors.muted },
  name: { fontFamily: font.bold, fontSize: 22, color: colors.text },
  bell: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
    shadowOpacity: 0.06,
    elevation: 3,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryDark,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },

  // Pulls the row up over the card: half the circle plus the container's own gap.
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -(spacing(4) + CIRCLE / 2),
  },
  action: { alignItems: 'center', gap: spacing(2), width: 74 },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: colors.surface,
    // Pale ring + a glow in the action's own colour: keeps the white circle clean
    // while giving each button its own identity. Both are set per action inline.
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  actionLabel: { fontFamily: font.semibold, fontSize: 11.5, color: colors.text },

  historyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyTitle: { fontFamily: font.bold, fontSize: 17, color: colors.text },
  seeAll: { fontFamily: font.medium, fontSize: 13, color: colors.primaryDark },
  history: { gap: spacing(2.5) },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
