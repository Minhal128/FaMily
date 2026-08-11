import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import ConfirmModal from '../components/ConfirmModal';
import EntryRow from '../components/EntryRow';
import Header from '../components/Header';
import Input from '../components/Input';
import Screen from '../components/Screen';
import {
  BudgetEvent,
  MonthBudget,
  budgetRemaining,
  canAddBudgetEvent,
  currentMonthKey,
  monthLabel,
  monthSpend,
  plannedVsActual,
} from '../lib/budget';
import { clearBudget, loadBudget, saveBudget } from '../lib/budgetStore';
import { parseAmount } from '../lib/format';
import { useApp } from '../state/AppContext';
import { colors, font, money, radius, spacing } from '../theme';

export default function BudgetScreen() {
  const { profileId, profile, expenses } = useApp();
  const month = currentMonthKey();
  const [budget, setBudget] = useState<MonthBudget | null>(null);
  const [ready, setReady] = useState(false);
  const [totalInput, setTotalInput] = useState('');
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setBudget(await loadBudget(profileId, month));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setReady(true);
    }
  }, [profileId, month]);

  useEffect(() => {
    setReady(false);
    refresh();
  }, [refresh]);

  const persist = async (next: MonthBudget) => {
    setBudget(await saveBudget(profileId, month, next));
  };

  const setTotal = async () => {
    if (busy) return;
    const value = parseAmount(totalInput);
    if (value === null) return setError('Enter a budget greater than zero.');

    setBusy(true);
    setError('');
    try {
      await persist({ total: value, events: [] });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const addEvent = async () => {
    if (busy || !budget) return;
    const amount = parseAmount(amountInput);
    if (!description.trim()) return setError('What is this event?');
    if (amount === null) return setError('Enter an amount greater than zero.');
    if (!canAddBudgetEvent(budget.total, budget.events, amount)) {
      return setError(
        `Only ${money(budgetRemaining(budget.total, budget.events))} left — can't go negative.`
      );
    }

    const event: BudgetEvent = {
      id: `${Date.now()}`,
      description: description.trim(),
      amount,
    };

    setBusy(true);
    setError('');
    try {
      await persist({ ...budget, events: [...budget.events, event] });
      setDescription('');
      setAmountInput('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const removeEvent = async (id: string) => {
    if (!budget || busy) return;
    setBusy(true);
    try {
      await persist({ ...budget, events: budget.events.filter((e) => e.id !== id) });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const deleteBudget = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await clearBudget(profileId, month);
      setBudget(null);
      setTotalInput('');
      setDescription('');
      setAmountInput('');
      setError('');
      setConfirmDelete(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <Screen tabBarSpace={false}>
        <Header title="Budget" subtitle={monthLabel(month)} />
        <ActivityIndicator color={colors.primaryDark} style={{ marginTop: spacing(8) }} />
      </Screen>
    );
  }

  if (!budget) {
    return (
      <Screen scroll tabBarSpace={false}>
        <Header
          title="Budget"
          subtitle={`${profile.name} · ${monthLabel(month)} only`}
        />
        <Card style={styles.sheet}>
          <Text style={styles.lead}>How much is this month's budget?</Text>
          <Input
            label="Total budget"
            value={totalInput}
            onChangeText={(t) => {
              setTotalInput(t);
              if (error) setError('');
            }}
            keyboardType="numeric"
            placeholder="1000"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Set budget" onPress={setTotal} loading={busy} />
        </Card>
      </Screen>
    );
  }

  const left = budgetRemaining(budget.total, budget.events);
  const filled = budget.total > 0 ? (budget.total - left) / budget.total : 0;
  const planned = budget.total - left;
  const actual = monthSpend(expenses, month);
  const vs = plannedVsActual(planned, actual);
  const over = vs.delta < 0;

  return (
    <Screen scroll tabBarSpace={false}>
      <Header title="Budget" subtitle={`${profile.name} · ${monthLabel(month)}`} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Card style={styles.summary}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, left === 0 && styles.done]}>
              {money(left)}
            </Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.summaryLabel}>Of {money(budget.total)}</Text>
            <Text style={styles.summaryMeta}>
              {left === 0 ? 'Fully planned' : `${money(planned)} planned`}
            </Text>
          </View>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { flex: filled }]} />
          <View style={{ flex: Math.max(0.0001, 1 - filled) }} />
        </View>
      </Card>

      <Card style={styles.compare}>
        <Text style={styles.lead}>Planned vs spent</Text>
        <View style={styles.compareRow}>
          <View style={styles.compareCol}>
            <Text style={styles.summaryLabel}>Planned</Text>
            <Text style={styles.compareValue}>{money(vs.planned)}</Text>
          </View>
          <View style={styles.compareCol}>
            <Text style={styles.summaryLabel}>Spent</Text>
            <Text style={[styles.compareValue, over && styles.overValue]}>
              {money(vs.actual)}
            </Text>
          </View>
        </View>
        <Text style={[styles.compareDelta, over ? styles.overValue : styles.done]}>
          {vs.planned === 0 && vs.actual === 0
            ? 'No plan or spend yet this month.'
            : over
              ? `Overspent by ${money(-vs.delta)}`
              : vs.delta === 0
                ? 'Right on plan.'
                : `Under plan by ${money(vs.delta)}`}
        </Text>
      </Card>

      {left > 0 ? (
        <Card style={styles.sheet}>
          <Text style={styles.lead}>Add an event</Text>
          <Input
            label="Description"
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              if (error) setError('');
            }}
            placeholder="Rent, groceries, trip…"
          />
          <Input
            label="Amount"
            value={amountInput}
            onChangeText={(t) => {
              setAmountInput(t);
              if (error) setError('');
            }}
            keyboardType="numeric"
            placeholder="0"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Add event" onPress={addEvent} loading={busy} />
        </Card>
      ) : (
        <Text style={styles.full}>Budget is fully allocated — nothing left to plan.</Text>
      )}

      <Text style={styles.listTitle}>This month's plan</Text>
      {budget.events.length === 0 ? (
        <Text style={styles.empty}>No events yet.</Text>
      ) : (
        budget.events.map((e) => (
          <Pressable key={e.id} onLongPress={() => removeEvent(e.id)}>
            <EntryRow
              icon="tag"
              title={e.description}
              subtitle="Long-press to remove"
              amount={money(e.amount)}
              amountColor={colors.text}
              tint="#EEF2FF"
            />
          </Pressable>
        ))
      )}

      <Pressable
        onPress={() => setConfirmDelete(true)}
        disabled={busy}
        style={({ pressed }) => [styles.deleteBudget, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.deleteBudgetText}>Delete this month's budget</Text>
      </Pressable>

      <ConfirmModal
        visible={confirmDelete}
        title="Delete this budget?"
        message="Events for this month will be cleared. You can set a new total after."
        confirmLabel="Delete budget"
        onConfirm={deleteBudget}
        onCancel={() => !busy && setConfirmDelete(false)}
        loading={busy}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: { gap: spacing(4) },
  lead: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  error: { fontFamily: font.regular, fontSize: 12, color: colors.danger },
  summary: { gap: spacing(3) },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  summaryRight: { alignItems: 'flex-end' },
  summaryLabel: { fontFamily: font.regular, fontSize: 12, color: colors.muted },
  summaryValue: { fontFamily: font.bold, fontSize: 28, color: colors.primaryDark, marginTop: 2 },
  done: { color: colors.success },
  summaryMeta: { fontFamily: font.medium, fontSize: 13, color: colors.text, marginTop: 2 },
  compare: { gap: spacing(3) },
  compareRow: { flexDirection: 'row', justifyContent: 'space-between' },
  compareCol: { flex: 1 },
  compareValue: { fontFamily: font.semibold, fontSize: 18, color: colors.text, marginTop: 2 },
  compareDelta: { fontFamily: font.medium, fontSize: 13 },
  overValue: { color: colors.danger },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  fill: { height: '100%', backgroundColor: colors.primaryDark, borderRadius: radius.pill },
  full: {
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.success,
    textAlign: 'center',
  },
  listTitle: { fontFamily: font.bold, fontSize: 16, color: colors.text },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
  deleteBudget: {
    alignItems: 'center',
    paddingVertical: spacing(4),
    marginTop: spacing(2),
  },
  deleteBudgetText: { fontFamily: font.semibold, fontSize: 14, color: colors.danger },
});
