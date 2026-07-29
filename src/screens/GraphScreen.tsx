import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BarChart from '../components/BarChart';
import Card from '../components/Card';
import Header from '../components/Header';
import Screen from '../components/Screen';
import { useApp } from '../state/AppContext';
import { colors, font, money, radius, spacing } from '../theme';
import { MonthKey } from '../types';

const SERIES = [
  { key: 'expense', label: 'Expense', color: colors.danger },
  { key: 'investment', label: 'Investment', color: colors.gold },
  { key: 'earning', label: 'Earning', color: colors.primaryDark },
  { key: 'saving', label: 'Saving', color: colors.success },
] as const;

export default function GraphScreen() {
  const { months } = useApp();
  const [selected, setSelected] = useState<MonthKey[]>(() => months.slice(-3).map((m) => m.month));
  const [overall, setOverall] = useState(false);

  const toggle = (month: MonthKey) =>
    setSelected((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );

  const shown = months.filter((m) => selected.includes(m.month));
  const aggregated = (shown.length ? shown : months).reduce(
    (total, m) => ({
      expense: total.expense + m.expense,
      investment: total.investment + m.investment,
      earning: total.earning + m.earning,
      saving: total.saving + m.saving,
    }),
    { expense: 0, investment: 0, earning: 0, saving: 0 }
  );

  return (
    <Screen scroll>
      <Header title="Graph view" subtitle="Compare months side by side" back={false} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chips}>
          {months.map((m) => {
            const active = selected.includes(m.month);
            return (
              <Pressable
                key={m.month}
                onPress={() => toggle(m.month)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{m.label}</Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setOverall((v) => !v)}
            style={[styles.chip, overall && styles.chipOverall]}
          >
            <Text style={[styles.chipText, overall && styles.chipTextActive]}>Overall</Text>
          </Pressable>
        </View>
      </ScrollView>

      {overall ? (
        <Card style={styles.summary}>
          <Text style={styles.summaryTitle}>
            Overall {shown.length ? `· ${shown.length} month(s)` : '· all time'}
          </Text>
          <View style={styles.summaryGrid}>
            {SERIES.map((s) => (
              <View key={s.key} style={styles.summaryItem}>
                <View style={[styles.dot, { backgroundColor: s.color }]} />
                <Text style={styles.summaryLabel}>Total {s.label}</Text>
                <Text style={[styles.summaryValue, { color: s.color }]}>
                  {money(aggregated[s.key])}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      ) : null}

      <Card>
        {shown.length ? (
          <BarChart
            series={SERIES.map((s) => ({ label: s.label, color: s.color }))}
            data={shown.map((m) => ({
              label: m.label,
              values: SERIES.map((s) => Math.max(0, m[s.key])),
            }))}
            height={180}
          />
        ) : (
          <Text style={styles.empty}>Pick at least one month to compare.</Text>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', gap: spacing(2), paddingVertical: spacing(1) },
  chip: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2.5),
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  chipOverall: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { fontFamily: font.medium, fontSize: 13, color: colors.muted },
  chipTextActive: { color: colors.surface },

  summary: { gap: spacing(3) },
  summaryTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(3) },
  summaryItem: {
    flexGrow: 1,
    flexBasis: '44%',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing(3),
    gap: 2,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: spacing(1) },
  summaryLabel: { fontFamily: font.regular, fontSize: 11, color: colors.muted },
  summaryValue: { fontFamily: font.bold, fontSize: 16 },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
