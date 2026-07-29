import type { Expense, Income, Investment, MonthKey, MonthSummary } from '../types';

/** Type-only imports above — this file has no runtime dependencies, so it stays testable. */

export const sum = (items: { amount: number }[]) => items.reduce((t, i) => t + i.amount, 0);

export const monthOf = (date: string): MonthKey => date.slice(0, 7);

export const monthLabel = (key: MonthKey) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

/** One row per month that has any activity, oldest first. Saving excludes investments. */
export function summarize(
  incomes: Income[],
  expenses: Expense[],
  investments: Investment[]
): MonthSummary[] {
  const keys = [...incomes, ...expenses, ...investments]
    .map((i) => monthOf(i.date))
    .filter((key, index, all) => all.indexOf(key) === index)
    .sort();

  return keys.map((month) => {
    const inMonth = <T extends { date: string }>(items: T[]) =>
      items.filter((i) => monthOf(i.date) === month);

    const earning = sum(inMonth(incomes));
    const expense = sum(inMonth(expenses));
    const investment = sum(inMonth(investments));

    return { month, label: monthLabel(month), earning, expense, investment, saving: earning - expense };
  });
}
