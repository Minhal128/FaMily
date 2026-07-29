import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BarChart from '../components/BarChart';
import Card from '../components/Card';
import EntryRow from '../components/EntryRow';
import GradientBackground from '../components/GradientBackground';
import Header from '../components/Header';
import Screen from '../components/Screen';
import { prettyDate } from '../lib/format';
import { useApp } from '../state/AppContext';
import { colors, font, money, radius, shadow, spacing } from '../theme';

export default function ExpenseScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { expenses, totalExpense, months } = useApp();

  const sorted = useMemo(
    () => [...expenses].sort((a, b) => b.date.localeCompare(a.date)),
    [expenses]
  );

  const trend = months.slice(-6).map((m) => ({ label: m.label, values: [m.expense] }));

  return (
    <View style={styles.flex}>
      <Screen tabBarSpace={false}>
        <Header title="Expenses" subtitle={`${money(totalExpense)} spent so far`} />

        <Card>
          <Text style={styles.chartTitle}>Spend trend</Text>
          {trend.length ? (
            <BarChart series={[{ label: 'Expense', color: colors.danger }]} data={trend} />
          ) : (
            <Text style={styles.empty}>No spend to chart yet.</Text>
          )}
        </Card>

        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing(2.5), paddingBottom: insets.bottom + 96 }}
          ListEmptyComponent={<Text style={styles.empty}>Nothing spent yet.</Text>}
          renderItem={({ item }) => (
            <EntryRow
              icon="shopping-bag"
              title={item.name}
              subtitle={item.category}
              meta={prettyDate(item.date)}
              amount={`- ${money(item.amount)}`}
              amountColor={colors.danger}
              tint="#FDECEA"
            />
          )}
        />
      </Screen>

      <Pressable
        onPress={() => navigation.navigate('AddExpense')}
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + spacing(6) },
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        ]}
      >
        <GradientBackground style={styles.fabInner}>
          <Feather name="plus" size={18} color={colors.surface} />
          <Text style={styles.fabText}>Add Expense</Text>
        </GradientBackground>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  chartTitle: {
    fontFamily: font.semibold,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing(3),
  },
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
