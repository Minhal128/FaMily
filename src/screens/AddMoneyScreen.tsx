import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import FormScreen from '../components/FormScreen';
import Input from '../components/Input';
import ProgressSlider from '../components/ProgressSlider';
import Segmented from '../components/Segmented';
import { isValidDate, parseAmount, todayISO } from '../lib/format';
import { useApp } from '../state/AppContext';
import { colors, font, money, spacing } from '../theme';
import { IncomeType } from '../types';

const TYPES = ['Monthly', 'One-time', 'Milestone'] as const satisfies readonly IncomeType[];

export default function AddMoneyScreen() {
  const navigation = useNavigation();
  const { addIncome } = useApp();

  const [source, setSource] = useState('');
  const [type, setType] = useState<IncomeType>('Monthly');
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [progress, setProgress] = useState(0.3);
  const [error, setError] = useState('');

  const milestone = type === 'Milestone';
  const target = parseAmount(amount) ?? 0;
  const credited = milestone ? Math.round(target * progress) : target;

  const submit = () => {
    if (!source.trim()) return setError('Where did the money come from?');
    if (!isValidDate(date)) return setError('Date must look like YYYY-MM-DD.');
    if (parseAmount(amount) === null) return setError('Enter an amount greater than zero.');
    if (milestone && credited <= 0) return setError('Slide the milestone past 0% to add money.');

    addIncome({
      source: source.trim(),
      type,
      date: date.trim(),
      description:
        description.trim() ||
        (milestone ? `Milestone ${Math.round(progress * 100)}% complete` : ''),
      amount: credited,
    });
    navigation.goBack();
  };

  return (
    <FormScreen
      title="Add Money"
      subtitle="Where it came from"
      submitLabel={milestone ? `Add ${money(credited)}` : 'Add to balance'}
      onSubmit={submit}
      error={error}
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
