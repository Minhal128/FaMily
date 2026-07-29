import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import GradientBackground from '../components/GradientBackground';
import Header from '../components/Header';
import Rise from '../components/Rise';
import Screen from '../components/Screen';
import { useApp } from '../state/AppContext';
import {
  brandGradient,
  colors,
  font,
  money,
  radius,
  shadow,
  signedMoney,
  spacing,
  successGradient,
} from '../theme';

export default function SavingScreen() {
  const { months, totalEarning, totalExpense } = useApp();
  const saved = totalEarning - totalExpense;
  const ordered = [...months].reverse();

  return (
    <Screen scroll tabBarSpace={false}>
      <Header title="Saving" subtitle="Added money minus expenses" />

      <View style={styles.total}>
        {/* Green while they're ahead; brand red the moment savings go negative. */}
        <GradientBackground
          colors={saved < 0 ? brandGradient : successGradient}
          style={styles.totalInner}
        >
          <View style={styles.totalTop}>
            <View>
              <Text style={styles.totalLabel}>Saved overall</Text>
              <Text style={styles.totalAmount}>{signedMoney(saved)}</Text>
            </View>
            <View style={styles.totalBadge}>
              <Feather name="shield" size={22} color={colors.surface} />
            </View>
          </View>

          <View style={styles.split}>
            <View style={styles.splitItem}>
              <Text style={styles.splitLabel}>Added</Text>
              <Text style={styles.splitValue}>{money(totalEarning)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.splitItem}>
              <Text style={styles.splitLabel}>Spent</Text>
              <Text style={styles.splitValue}>{money(totalExpense)}</Text>
            </View>
          </View>

          <Text style={styles.note}>Investments are tracked separately and don't reduce savings.</Text>
        </GradientBackground>
      </View>

      {ordered.map((month, index) => (
        <Rise key={month.month} index={index}>
        <Card style={styles.monthCard}>
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
        </Rise>
      ))}

      {ordered.length === 0 ? <Text style={styles.empty}>Nothing to summarise yet.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  total: { borderRadius: radius.lg, overflow: 'hidden', ...shadow, shadowOpacity: 0.18 },
  totalInner: { padding: spacing(5), gap: spacing(4) },
  totalTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontFamily: font.regular, fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  totalAmount: { fontFamily: font.bold, fontSize: 34, color: colors.surface, marginTop: 2 },
  totalBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  split: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.md,
    padding: spacing(3.5),
  },
  splitItem: { flex: 1, gap: 2 },
  divider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)' },
  splitLabel: { fontFamily: font.regular, fontSize: 11, color: 'rgba(255,255,255,0.85)' },
  splitValue: { fontFamily: font.semibold, fontSize: 16, color: colors.surface },
  note: { fontFamily: font.regular, fontSize: 11, color: 'rgba(255,255,255,0.75)' },

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
