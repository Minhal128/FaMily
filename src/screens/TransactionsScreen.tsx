import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EntryActionsModal from '../components/EntryActionsModal';
import EntryRow from '../components/EntryRow';
import Header from '../components/Header';
import Rise from '../components/Rise';
import Screen from '../components/Screen';
import { relativeDate } from '../lib/format';
import { buildTransactions, Transaction, TxKind } from '../lib/transactions';
import { useApp } from '../state/AppContext';
import { colors, font, money, spacing } from '../theme';

const LOOK: Record<
  TxKind,
  {
    icon: 'arrow-down-left' | 'arrow-up-right' | 'trending-up';
    color: string;
    tint: string;
    route: 'AddMoney' | 'AddExpense' | 'AddInvestment';
  }
> = {
  income: {
    icon: 'arrow-down-left',
    color: colors.success,
    tint: '#E7F8EF',
    route: 'AddMoney',
  },
  expense: {
    icon: 'arrow-up-right',
    color: colors.danger,
    tint: '#FDECEA',
    route: 'AddExpense',
  },
  investment: {
    icon: 'trending-up',
    color: colors.gold,
    tint: '#FBF3DC',
    route: 'AddInvestment',
  },
};

function amountLabel(t: Transaction) {
  if (t.kind === 'investment') return money(t.amount);
  return `${t.amount > 0 ? '+' : '-'} ${money(t.amount)}`;
}

export default function TransactionsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    incomes,
    expenses,
    investments,
    deleteIncome,
    deleteExpense,
    deleteInvestment,
  } = useApp();
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const transactions = useMemo(
    () => buildTransactions(incomes, expenses, investments),
    [incomes, expenses, investments]
  );

  const close = () => {
    if (deleting) return;
    setSelected(null);
  };

  const onEdit = () => {
    if (!selected) return;
    const t = selected;
    setSelected(null);
    navigation.navigate(LOOK[t.kind].route, { id: t.id });
  };

  const onDelete = async () => {
    if (!selected || deleting) return;
    const t = selected;
    setDeleting(true);
    try {
      if (t.kind === 'income') await deleteIncome(t.id);
      else if (t.kind === 'expense') await deleteExpense(t.id);
      else await deleteInvestment(t.id);
      setSelected(null);
    } catch (err) {
      Alert.alert('Could not delete', (err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Screen tabBarSpace={false}>
      <Header title="Transactions" subtitle="All money in and out" />
      <FlatList
        data={transactions}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing(2.5), paddingBottom: insets.bottom + spacing(4) }}
        ListEmptyComponent={<Text style={styles.empty}>No transactions yet.</Text>}
        renderItem={({ item, index }) => {
          const look = LOOK[item.kind];
          return (
            <Rise index={Math.min(index, 8)}>
              <EntryRow
                icon={look.icon}
                title={item.name}
                subtitle={relativeDate(item.date)}
                amount={amountLabel(item)}
                amountColor={look.color}
                tint={look.tint}
                onPress={() => setSelected(item)}
              />
            </Rise>
          );
        }}
      />

      <EntryActionsModal
        visible={!!selected}
        title={selected?.name ?? ''}
        onClose={close}
        onEdit={onEdit}
        onDelete={onDelete}
        deleting={deleting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
