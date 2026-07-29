import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import FormScreen from '../components/FormScreen';
import Input from '../components/Input';
import { isValidDate, parseAmount, todayISO } from '../lib/format';
import { useApp } from '../state/AppContext';

export default function AddInvestmentScreen() {
  const navigation = useNavigation();
  const { addInvestment } = useApp();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const value = parseAmount(amount);
    if (!name.trim()) return setError('Name the investment.');
    if (value === null) return setError('Enter an amount greater than zero.');
    if (!isValidDate(date)) return setError('Date must look like YYYY-MM-DD.');

    addInvestment({ name: name.trim(), amount: value, date: date.trim(), note: note.trim() });
    navigation.goBack();
  };

  return (
    <FormScreen
      title="Add Investment"
      subtitle="What you put away"
      submitLabel="Save investment"
      onSubmit={submit}
      error={error}
    >
      <Input
        label="Name / type"
        value={name}
        onChangeText={setName}
        placeholder="Gold savings, Mutual fund…"
      />
      <Input
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="0"
      />
      <Input label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
      <Input label="Note" value={note} onChangeText={setNote} placeholder="Optional" />
    </FormScreen>
  );
}
