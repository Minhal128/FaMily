export type BudgetEvent = {
  id: string;
  description: string;
  amount: number;
};

export type MonthBudget = {
  total: number;
  events: BudgetEvent[];
};

const pad = (n: number) => String(n).padStart(2, '0');

/** YYYY-MM for "only this month". */
export const currentMonthKey = (now = new Date()) =>
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;

export const monthLabel = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const budgetRemaining = (total: number, events: { amount: number }[]) =>
  total - events.reduce((sum, e) => sum + e.amount, 0);

/** True only when the event fits without going negative. */
export const canAddBudgetEvent = (
  total: number,
  events: { amount: number }[],
  amount: number
) => amount > 0 && amount <= budgetRemaining(total, events);

/** Sum of expenses whose date falls in YYYY-MM. */
export const monthSpend = (
  expenses: { date: string; amount: number }[],
  month: string
) =>
  expenses
    .filter((e) => e.date.slice(0, 7) === month)
    .reduce((sum, e) => sum + e.amount, 0);

/**
 * Planned = sum of budget events. Actual = real spend that month.
 * delta > 0 under plan, delta < 0 overspent.
 */
export const plannedVsActual = (planned: number, actual: number) => ({
  planned,
  actual,
  delta: planned - actual,
});
