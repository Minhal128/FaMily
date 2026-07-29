import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import FormScreen from '../components/FormScreen';
import Input from '../components/Input';
import { isValidDate, nowStamp, parseAmount } from '../lib/format';
import { useApp } from '../state/AppContext';

export default function AddExpenseScreen() {
  const navigation = useNavigation();
  const { addExpense } = useApp();

  const [date, setDate] = useState(nowStamp());
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const value = parseAmount(amount);
    if (!isValidDate(date)) return setError('Date must look like YYYY-MM-DD HH:mm.');
    if (!name.trim()) return setError('What was it for?');
    if (value === null) return setError('Enter an amount greater than zero.');

    addExpense({ date: date.trim(), name: name.trim(), category: category.trim(), amount: value });
    navigation.goBack();
  };

  return (
    <FormScreen
      title="Add Expense"
      subtitle="What you spent on"
      submitLabel="Subtract from balance"
      onSubmit={submit}
      error={error}
    >
      <Input label="Date & time" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD HH:mm" />
      <Input label="Name" value={name} onChangeText={setName} placeholder="Groceries, Rent…" />
      <Input
        label="Category / description"
        value={category}
        onChangeText={setCategory}
        placeholder="Weekly top-up"
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
