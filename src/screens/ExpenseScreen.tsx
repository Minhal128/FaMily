import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Dropdown from '../components/Dropdown';
import EntryRow from '../components/EntryRow';
import GradientBackground from '../components/GradientBackground';
import Header from '../components/Header';
import LineChart from '../components/LineChart';
import Rise from '../components/Rise';
import Screen from '../components/Screen';
import Segmented from '../components/Segmented';
import { Period, bucketise } from '../lib/buckets';
import { relativeDate } from '../lib/format';
import { useApp } from '../state/AppContext';
import { colors, font, money, radius, shadow, spacing } from '../theme';

const PERIODS = ['Day', 'Week', 'Month', 'Year'] as const satisfies readonly Period[];
const KINDS = ['Expense', 'Income', 'Investment'] as const;
type Kind = (typeof KINDS)[number];

const LOOK = {
  Expense: {
    title: 'Expenses',
    lead: 'Top spending',
    route: 'AddExpense',
    fab: 'Add Expense',
    icon: 'shopping-bag',
    color: colors.danger,
    tint: '#FDECEA',
    sign: '- ',
  },
  Income: {
    title: 'Earnings',
    lead: 'Top earnings',
    route: 'AddMoney',
    fab: 'Add Money',
    icon: 'arrow-down-left',
    color: colors.success,
    tint: '#E7F8EF',
    sign: '+ ',
  },
  Investment: {
    title: 'Investments',
    lead: 'Biggest investments',
    route: 'AddInvestment',
    fab: 'Add Investment',
    icon: 'trending-up',
    color: colors.gold,
    tint: '#FBF3DC',
    sign: '',
  },
} as const;

export default function ExpenseScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { expenses, incomes, investments } = useApp();

  const [kind, setKind] = useState<Kind>('Expense');
  const [period, setPeriod] = useState<Period>('Month');
  const [byAmount, setByAmount] = useState(true);
  const [active, setActive] = useState<number | undefined>(undefined);

  const look = LOOK[kind];

  // One shape for all three kinds, so the chart and list don't care which is showing.
  const items = useMemo(() => {
    if (kind === 'Income')
      return incomes.map((i) => ({
        id: i.id,
        title: i.source,
        subtitle: i.description,
        date: i.date,
        amount: i.amount,
      }));
    if (kind === 'Investment')
      return investments.map((i) => ({
        id: i.id,
        title: i.name,
        subtitle: i.note,
        date: i.date,
        amount: i.amount,
      }));
    return expenses.map((e) => ({
      id: e.id,
      title: e.name,
      subtitle: e.category,
      date: e.date,
      amount: e.amount,
    }));
  }, [kind, expenses, incomes, investments]);

  const buckets = useMemo(() => bucketise(items, period), [items, period]);
  const total = items.reduce((t, i) => t + i.amount, 0);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) =>
        byAmount ? b.amount - a.amount : b.date.localeCompare(a.date)
      ),
    [items, byAmount]
  );

  return (
    <View style={styles.flex}>
      <Screen tabBarSpace={false}>
        <Header title={look.title} subtitle={`${money(total)} in total`} />

        <Segmented options={PERIODS} value={period} onChange={setPeriod} />

        <View style={styles.filterRow}>
          <Text style={styles.chartTitle}>
            {period === 'Day' ? 'This week' : `Last ${buckets.length} ${period.toLowerCase()}s`}
          </Text>
          <Dropdown value={kind} options={KINDS} onChange={setKind} />
        </View>

        <Card>
          <LineChart
            data={buckets}
            color={look.color}
            height={150}
            activeIndex={active}
            onSelect={(index) => setActive(index === active ? undefined : index)}
          />
          <Text style={styles.chartHint}>tap a point for its total</Text>
        </Card>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{look.lead}</Text>
          <Pressable
            onPress={() => setByAmount((v) => !v)}
            hitSlop={8}
            style={styles.sort}
            accessibilityLabel={byAmount ? 'Sort by date' : 'Sort by amount'}
          >
            <Feather name="repeat" size={13} color={colors.primaryDark} />
            <Text style={styles.sortText}>{byAmount ? 'By amount' : 'By date'}</Text>
          </Pressable>
        </View>

        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing(2.5), paddingBottom: insets.bottom + 96 }}
          ListEmptyComponent={<Text style={styles.empty}>Nothing here yet.</Text>}
          renderItem={({ item, index }) => (
            <Rise index={index}>
              <EntryRow
                icon={look.icon}
                title={item.title}
                subtitle={item.subtitle || relativeDate(item.date)}
                meta={item.subtitle ? relativeDate(item.date) : undefined}
                amount={`${look.sign}${money(item.amount)}`}
                amountColor={look.color}
                tint={look.tint}
              />
            </Rise>
          )}
        />
      </Screen>

      <Pressable
        onPress={() => navigation.navigate(look.route)}
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + spacing(6) },
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        ]}
      >
        <GradientBackground style={styles.fabInner}>
          <Feather name="plus" size={18} color={colors.surface} />
          <Text style={styles.fabText}>{look.fab}</Text>
        </GradientBackground>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  chartTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  chartHint: {
    fontFamily: font.regular,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing(2),
  },

  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listTitle: { fontFamily: font.bold, fontSize: 17, color: colors.text },
  sort: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  sortText: { fontFamily: font.medium, fontSize: 12, color: colors.primaryDark },

  empty: { fontFamily: font.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...shadow,
    shadowOpacity: 0.25,
    elevation: 12,
  },
  fabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(4),
  },
  fabText: { fontFamily: font.semibold, fontSize: 15, color: colors.surface },
});
