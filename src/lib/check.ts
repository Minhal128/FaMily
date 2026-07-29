import assert from 'node:assert/strict';
import { isValidDate, parseAmount, prettyDate } from './format.ts';
import { summarize } from './summary.ts';

// Money math: run with `npm run check`.
const incomes = [
  { id: '1', owner: 'you', source: 'Salary', type: 'Monthly', date: '2026-06-01', description: '', amount: 100 },
  { id: '2', owner: 'you', source: 'Gift', type: 'One-time', date: '2026-07-04', description: '', amount: 50 },
] as const;
const expenses = [
  { id: '3', owner: 'you', name: 'Rent', category: '', date: '2026-06-02 10:00', amount: 40 },
  { id: '4', owner: 'you', name: 'Food', category: '', date: '2026-07-09 18:00', amount: 70 },
] as const;
const investments = [
  { id: '5', owner: 'you', name: 'Gold', date: '2026-07-06', note: '', amount: 25 },
] as const;

const months = summarize([...incomes], [...expenses], [...investments]);

assert.equal(months.length, 2, 'one row per active month');
assert.deepEqual(
  months.map((m) => m.month),
  ['2026-06', '2026-07'],
  'oldest first'
);
assert.equal(months[0].saving, 60, 'June: 100 earned - 40 spent');
assert.equal(months[1].saving, -20, 'July: 50 earned - 70 spent, can go negative');
assert.equal(months[1].investment, 25, 'investments are counted but never reduce saving');
assert.equal(months[1].expense, 70, 'timestamps still bucket by month');

assert.equal(parseAmount('1,250'), 1250, 'commas are stripped');
assert.equal(parseAmount('0'), null, 'zero is not an amount');
assert.equal(parseAmount('-5'), 5, 'sign is stripped, magnitude kept');
assert.equal(parseAmount('abc'), null, 'garbage in, null out');

assert.equal(isValidDate('2026-07-30'), true);
assert.equal(isValidDate('2026-07-30 14:05'), true);
assert.equal(isValidDate('30/07/2026'), false);

assert.equal(prettyDate('2026-07-30 14:05'), 'Jul 30 · 14:05');
assert.equal(prettyDate('2026-07-30'), 'Jul 30');

console.log('ok — all checks passed');
