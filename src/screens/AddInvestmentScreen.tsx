import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import FormScreen from '../components/FormScreen';
import Input from '../components/Input';
import { isValidDate, parseAmount, todayISO } from '../lib/format';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../state/AppContext';

export default function AddInvestmentScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'AddInvestment'>>();
  const { investments, addInvestment, updateInvestment } = useApp();
  const editing = params?.id ? investments.find((i) => i.id === params.id) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [note, setNote] = useState(editing?.note ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    const value = parseAmount(amount);
    if (!name.trim()) return setError('Name the investment.');
    if (value === null) return setError('Enter an amount greater than zero.');
    if (!isValidDate(date)) return setError('Date must look like YYYY-MM-DD.');

    const draft = {
      name: name.trim(),
      amount: value,
      date: date.trim(),
      note: note.trim(),
    };

    setBusy(true);
    try {
      if (editing) await updateInvestment(editing.id, draft);
      else await addInvestment(draft);
      navigation.goBack();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormScreen
      title={editing ? 'Edit Investment' : 'Add Investment'}
      subtitle="What you put away"
      submitLabel={editing ? 'Save changes' : 'Save investment'}
      onSubmit={submit}
      error={error}
      loading={busy}
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
