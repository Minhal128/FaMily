export type Period = 'Day' | 'Week' | 'Month' | 'Year';
export type Bucket = { label: string; value: number };

/** How many buckets each period shows, newest last. */
const SPAN: Record<Period, number> = { Day: 7, Week: 6, Month: 6, Year: 3 };

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** "2026-07-15 14:05" -> Date. Hermes won't parse that shape itself. */
const parse = (value: string) => {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** First day of the bucket `date` falls into. Weeks start Monday. */
const startOf = (period: Period, date: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (period === 'Week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  if (period === 'Month') d.setDate(1);
  if (period === 'Year') {
    d.setMonth(0);
    d.setDate(1);
  }
  return d;
};

const stepBack = (period: Period, from: Date, steps: number) => {
  // Month/Year are rebuilt from parts, never by subtracting from the current day:
  // setMonth() on Jul 30 minus 5 overflows Feb 30 into Mar 2, which loses February
  // and produces two March buckets. new Date(y, m - steps, 1) handles negative months.
  if (period === 'Month') return new Date(from.getFullYear(), from.getMonth() - steps, 1);
  if (period === 'Year') return new Date(from.getFullYear() - steps, 0, 1);

  const d = new Date(from);
  d.setDate(d.getDate() - (period === 'Week' ? steps * 7 : steps));
  return d;
};

const labelOf = (period: Period, start: Date) => {
  if (period === 'Day') return start.toLocaleDateString('en-US', { weekday: 'short' });
  if (period === 'Week') return start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  if (period === 'Month') return start.toLocaleDateString('en-US', { month: 'short' });
  return String(start.getFullYear());
};

/** Totals per period bucket, oldest first, ending with the one `now` falls into. */
export function bucketise(
  items: { date: string; amount: number }[],
  period: Period,
  now = new Date()
): Bucket[] {
  const keyed = items.map((item) => ({
    key: iso(startOf(period, parse(item.date))),
    amount: item.amount,
  }));

  return Array.from({ length: SPAN[period] }, (_, i) => {
    const start = startOf(period, stepBack(period, now, SPAN[period] - 1 - i));
    const key = iso(start);
    return {
      label: labelOf(period, start),
      value: keyed.reduce((total, item) => (item.key === key ? total + item.amount : total), 0),
    };
  });
}
