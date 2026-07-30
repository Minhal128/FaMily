import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import LineChart from '../components/LineChart';
import Screen from '../components/Screen';
import { analyse } from '../lib/analysis';
import { useApp } from '../state/AppContext';
import { colors, font, money, radius, spacing } from '../theme';
import { MonthKey } from '../types';

const SERIES = [
  { key: 'expense', label: 'Expense', color: colors.danger },
  { key: 'investment', label: 'Investment', color: colors.gold },
  { key: 'earning', label: 'Earning', color: colors.primaryDark },
  { key: 'saving', label: 'Saving', color: colors.success },
] as const;

type Metric = 'All' | (typeof SERIES)[number]['label'];

const TONE = { good: colors.success, bad: colors.danger, flat: colors.muted };

export default function GraphScreen() {
  const { months } = useApp();
  const [selected, setSelected] = useState<MonthKey[]>(() => months.slice(-3).map((m) => m.month));
  const [metric, setMetric] = useState<Metric>('All');
  const [overall, setOverall] = useState(false);
  const [point, setPoint] = useState<number>();

  const series = metric === 'All' ? SERIES : SERIES.filter((s) => s.label === metric);

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

      <Text style={styles.rowLabel}>Show</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chips}>
          {(['All', ...SERIES.map((s) => s.label)] as Metric[]).map((option) => {
            const active = metric === option;
            const tint = SERIES.find((s) => s.label === option)?.color ?? colors.text;
            return (
              <Pressable
                key={option}
                onPress={() => setMetric(option)}
                style={[styles.chip, active && { backgroundColor: tint, borderColor: tint }]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Text style={styles.rowLabel}>Months</Text>
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
            {series.map((s) => (
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
          <>
            <LineChart
              lines={series.map((s) => ({
                label: s.label,
                color: s.color,
                data: shown.map((m) => ({ label: m.label, value: Math.max(0, m[s.key]) })),
              }))}
              height={180}
              activeIndex={point}
              onSelect={(index) => setPoint(index === point ? undefined : index)}
            />
            <Text style={styles.hint}>tap a month for its totals</Text>
          </>
        ) : (
          <Text style={styles.empty}>Pick at least one month to compare.</Text>
        )}
      </Card>

      {shown.length ? (
        <Card style={styles.summary}>
          <Text style={styles.summaryTitle}>What the graph says</Text>
          {analyse(shown, money).map((insight) => (
            <View key={insight.text} style={styles.insight}>
              <View style={[styles.insightDot, { backgroundColor: TONE[insight.tone] }]} />
              <Text style={styles.insightText}>{insight.text}</Text>
            </View>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowLabel: {
    fontFamily: font.medium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
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
  hint: { fontFamily: font.regular, fontSize: 11, color: colors.muted, textAlign: 'center' },
  insight: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing(2) },
  insightDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  insightText: { flex: 1, fontFamily: font.regular, fontSize: 13, color: colors.text, lineHeight: 19 },
  summaryLabel: { fontFamily: font.regular, fontSize: 11, color: colors.muted },
  summaryValue: { fontFamily: font.bold, fontSize: 16 },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
