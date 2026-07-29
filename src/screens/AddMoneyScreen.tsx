import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import FormScreen from '../components/FormScreen';
import Input from '../components/Input';
import Segmented from '../components/Segmented';
import { isValidDate, parseAmount, todayISO } from '../lib/format';
import { useApp } from '../state/AppContext';
import { IncomeType } from '../types';

const TYPES = ['Monthly', 'One-time'] as const satisfies readonly IncomeType[];

export default function AddMoneyScreen() {
  const navigation = useNavigation();
  const { addIncome } = useApp();

  const [source, setSource] = useState('');
  const [type, setType] = useState<IncomeType>('Monthly');
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const value = parseAmount(amount);
    if (!source.trim()) return setError('Where did the money come from?');
    if (!isValidDate(date)) return setError('Date must look like YYYY-MM-DD.');
    if (value === null) return setError('Enter an amount greater than zero.');

    addIncome({ source: source.trim(), type, date: date.trim(), description: description.trim(), amount: value });
    navigation.goBack();
  };

  return (
    <FormScreen title="Add Money" submitLabel="Add to balance" onSubmit={submit} error={error}>
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
        placeholder="What is this for?"
      />
      <Input
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="0"
      />
    </FormScreen>
  );
}
