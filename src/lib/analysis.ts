import type { MonthSummary } from '../types';

/** Type-only import above — like the rest of src/lib this file stays runtime-free, so `npm run check` can load it. */

export type Insight = { text: string; tone: 'good' | 'bad' | 'flat' };

const pct = (part: number, whole: number) => Math.round((part / whole) * 100);

/**
 * Plain-language read of whichever months are currently on the chart, strongest signal first.
 * `money` is injected rather than imported so this stays free of the theme (and of React Native).
 */
export function analyse(rows: MonthSummary[], money: (n: number) => string = String): Insight[] {
  if (!rows.length) return [];

  const total = rows.reduce(
    (t, m) => ({
      earning: t.earning + m.earning,
      expense: t.expense + m.expense,
      investment: t.investment + m.investment,
      saving: t.saving + m.saving,
    }),
    { earning: 0, expense: 0, investment: 0, saving: 0 }
  );

  const out: Insight[] = [];

  if (total.earning > 0) {
    const rate = pct(total.saving, total.earning);
    out.push({
      text: `Kept ${rate}% of what you earned — ${money(total.saving)} out of ${money(total.earning)}.`,
      tone: rate >= 20 ? 'good' : rate >= 0 ? 'flat' : 'bad',
    });
  }

  // Month-on-month only reads the last two months on screen, so it follows the chips.
  if (rows.length > 1) {
    const [prev, last] = rows.slice(-2);
    if (prev.expense > 0) {
      const change = pct(last.expense - prev.expense, prev.expense);
      out.push({
        text:
          change === 0
            ? `Spending held flat from ${prev.label} to ${last.label}.`
            : `Spending ${change > 0 ? 'rose' : 'fell'} ${Math.abs(change)}% from ${prev.label} to ${last.label}.`,
        tone: change > 0 ? 'bad' : change < 0 ? 'good' : 'flat',
      });
    }
  }

  const deficits = rows.filter((m) => m.saving < 0);
  if (deficits.length) {
    out.push({
      text: `${deficits.map((m) => m.label).join(', ')} spent more than earned.`,
      tone: 'bad',
    });
  } else {
    const best = rows.reduce((a, b) => (b.saving > a.saving ? b : a));
    out.push({ text: `${best.label} saved the most at ${money(best.saving)}.`, tone: 'good' });
  }

  if (total.expense > 0) {
    const priciest = rows.reduce((a, b) => (b.expense > a.expense ? b : a));
    out.push({
      text: `${priciest.label} was the heaviest month at ${money(priciest.expense)} — ${pct(priciest.expense, total.expense)}% of everything shown.`,
      tone: 'flat',
    });
  }

  if (total.investment > 0 && total.earning > 0) {
    out.push({
      text: `${money(total.investment)} went into investments, ${pct(total.investment, total.earning)}% of earnings.`,
      tone: 'good',
    });
  }

  return out;
}
