import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import FormScreen from '../components/FormScreen';
import Input from '../components/Input';
import ProgressSlider from '../components/ProgressSlider';
import Segmented from '../components/Segmented';
import { isValidDate, parseAmount, todayISO } from '../lib/format';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../state/AppContext';
import { colors, font, money, spacing } from '../theme';
import { IncomeType } from '../types';

const TYPES = ['Monthly', 'One-time', 'Milestone'] as const satisfies readonly IncomeType[];

export default function AddMoneyScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'AddMoney'>>();
  const { incomes, addIncome, updateIncome } = useApp();
  const editing = params?.id ? incomes.find((i) => i.id === params.id) : undefined;

  const [source, setSource] = useState(editing?.source ?? '');
  const [type, setType] = useState<IncomeType>(editing?.type ?? 'Monthly');
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [description, setDescription] = useState(editing?.description ?? '');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [progress, setProgress] = useState(0.3);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // ponytail: edit skips the milestone slider — amount is the stored credit.
  const milestone = !editing && type === 'Milestone';
  const target = parseAmount(amount) ?? 0;
  const credited = milestone ? Math.round(target * progress) : target;

  const submit = async () => {
    if (busy) return;
    if (!source.trim()) return setError('Where did the money come from?');
    if (!isValidDate(date)) return setError('Date must look like YYYY-MM-DD.');
    if (parseAmount(amount) === null) return setError('Enter an amount greater than zero.');
    if (milestone && credited <= 0) return setError('Slide the milestone past 0% to add money.');

    const draft = {
      source: source.trim(),
      type,
      date: date.trim(),
      description:
        description.trim() ||
        (milestone ? `Milestone ${Math.round(progress * 100)}% complete` : ''),
      amount: credited,
    };

    setBusy(true);
    try {
      if (editing) await updateIncome(editing.id, draft);
      else await addIncome(draft);
      navigation.goBack();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormScreen
      title={editing ? 'Edit Money' : 'Add Money'}
      subtitle="Where it came from"
      submitLabel={
        editing
          ? 'Save changes'
          : milestone
            ? `Add ${money(credited)}`
            : 'Add to balance'
      }
      onSubmit={submit}
      error={error}
      loading={busy}
    >
      <Input
        label="Source of income"
        value={source}
        onChangeText={setSource}
        placeholder="Salary, Freelance, Gift…"
      />
      <Segmented label="Type" options={TYPES} value={type} onChange={setType} />
      <Input label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder={milestone ? 'M1 delivered' : 'What is this for?'}
      />
      <Input
        label={milestone ? 'Full milestone value' : 'Amount'}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="0"
      />

      {milestone ? (
        <>
          <ProgressSlider label="Milestone progress" value={progress} onChange={setProgress} />
          <Text style={styles.preview}>
            Adding <Text style={styles.previewStrong}>{money(credited)}</Text> of {money(target)}
          </Text>
        </>
      ) : null}
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  preview: {
    fontFamily: font.regular,
    fontSize: 12,
    color: colors.muted,
    marginTop: -spacing(2),
  },
  previewStrong: { fontFamily: font.semibold, color: colors.success },
});
