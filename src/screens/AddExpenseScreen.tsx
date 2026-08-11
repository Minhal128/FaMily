import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import FormScreen from '../components/FormScreen';
import Input from '../components/Input';
import { isValidDate, nowStamp, parseAmount } from '../lib/format';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../state/AppContext';

export default function AddExpenseScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'AddExpense'>>();
  const { expenses, addExpense, updateExpense } = useApp();
  const editing = params?.id ? expenses.find((e) => e.id === params.id) : undefined;

  const [date, setDate] = useState(editing?.date ?? nowStamp());
  const [name, setName] = useState(editing?.name ?? '');
  const [category, setCategory] = useState(editing?.category ?? '');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    const value = parseAmount(amount);
    if (!isValidDate(date)) return setError('Date must look like YYYY-MM-DD HH:mm.');
    if (!name.trim()) return setError('What was it for?');
    if (value === null) return setError('Enter an amount greater than zero.');

    const draft = {
      date: date.trim(),
      name: name.trim(),
      category: category.trim(),
      amount: value,
    };

    setBusy(true);
    try {
      if (editing) await updateExpense(editing.id, draft);
      else await addExpense(draft);
      navigation.goBack();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormScreen
      title={editing ? 'Edit Expense' : 'Add Expense'}
      subtitle="What you spent on"
      submitLabel={editing ? 'Save changes' : 'Subtract from balance'}
      onSubmit={submit}
      error={error}
      loading={busy}
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
