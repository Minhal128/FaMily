export type TxKind = 'income' | 'expense' | 'investment';

export type Transaction = {
  id: string;
  kind: TxKind;
  name: string;
  date: string;
  /** Signed for income/expense; investments stay positive. */
  amount: number;
};

/** Newest date first. O(n²) — fine for a household list; use Array.sort if it ever gets huge. */
export function bubbleSortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  const a = [...items];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j].date < a[j + 1].date) {
        const tmp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = tmp;
      }
    }
  }
  return a;
}

export function buildTransactions(
  incomes: { id: string; source: string; date: string; amount: number }[],
  expenses: { id: string; name: string; date: string; amount: number }[],
  investments: { id: string; name: string; date: string; amount: number }[]
): Transaction[] {
  return bubbleSortByDateDesc([
    ...incomes.map((i) => ({
      id: i.id,
      kind: 'income' as const,
      name: i.source,
      date: i.date,
      amount: i.amount,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      kind: 'expense' as const,
      name: e.name,
      date: e.date,
      amount: -e.amount,
    })),
    ...investments.map((i) => ({
      id: i.id,
      kind: 'investment' as const,
      name: i.name,
      date: i.date,
      amount: i.amount,
    })),
  ]);
}
