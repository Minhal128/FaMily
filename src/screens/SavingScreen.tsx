import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import Screen from '../components/Screen';
import { useApp } from '../state/AppContext';
import { colors, font, money, signedMoney, spacing } from '../theme';

export default function SavingScreen() {
  const { months, totalEarning, totalExpense } = useApp();
  const saved = totalEarning - totalExpense;
  const ordered = [...months].reverse();

  return (
    <Screen scroll tabBarSpace={false}>
      <Header title="Saving" subtitle="Added money minus expenses" />

      <Card style={styles.total}>
        <Text style={styles.totalLabel}>Saved overall</Text>
        <Text style={[styles.totalAmount, { color: saved < 0 ? colors.danger : colors.success }]}>
          {signedMoney(saved)}
        </Text>
        <View style={styles.split}>
          <View style={styles.splitItem}>
            <Text style={styles.splitLabel}>Added</Text>
            <Text style={styles.splitValue}>{money(totalEarning)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.splitItem}>
            <Text style={styles.splitLabel}>Spent</Text>
            <Text style={[styles.splitValue, { color: colors.danger }]}>{money(totalExpense)}</Text>
          </View>
        </View>
        <Text style={styles.note}>Investments are tracked separately and don't reduce savings.</Text>
      </Card>

      {ordered.map((month) => (
        <Card key={month.month} style={styles.monthCard}>
          <View style={styles.monthTop}>
            <Text style={styles.monthLabel}>{month.label}</Text>
            <Text
              style={[
                styles.monthSaving,
                { color: month.saving < 0 ? colors.danger : colors.success },
              ]}
            >
              {signedMoney(month.saving)}
            </Text>
          </View>
          <View style={styles.monthRow}>
            <Text style={styles.monthKey}>Added</Text>
            <Text style={styles.monthValue}>{money(month.earning)}</Text>
          </View>
          <View style={styles.monthRow}>
            <Text style={styles.monthKey}>Expenses</Text>
            <Text style={[styles.monthValue, { color: colors.danger }]}>
              {money(month.expense)}
            </Text>
          </View>
        </Card>
      ))}

      {ordered.length === 0 ? <Text style={styles.empty}>Nothing to summarise yet.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  total: { gap: spacing(1) },
  totalLabel: { fontFamily: font.regular, fontSize: 13, color: colors.muted },
  totalAmount: { fontFamily: font.bold, fontSize: 34 },
  split: { flexDirection: 'row', alignItems: 'center', marginTop: spacing(3) },
  splitItem: { flex: 1, gap: 2 },
  divider: { width: 1, height: 32, backgroundColor: colors.border },
  splitLabel: { fontFamily: font.regular, fontSize: 12, color: colors.muted },
  splitValue: { fontFamily: font.semibold, fontSize: 16, color: colors.text },
  note: { fontFamily: font.regular, fontSize: 11, color: colors.muted, marginTop: spacing(3) },

  monthCard: { gap: spacing(2) },
  monthTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(1),
  },
  monthLabel: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  monthSaving: { fontFamily: font.bold, fontSize: 17 },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between' },
  monthKey: { fontFamily: font.regular, fontSize: 13, color: colors.muted },
  monthValue: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
