import assert from 'node:assert/strict';
import { analyse } from './analysis.ts';
import { bucketise } from './buckets.ts';
import {
  greeting,
  isValidDate,
  parseAmount,
  prettyDate,
  relativeDate,
  revealLines,
} from './format.ts';
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

assert.equal(greeting(9), 'Good morning');
assert.equal(greeting(13), 'Good afternoon');
assert.equal(greeting(20), 'Good evening');
assert.equal(greeting(0), 'Good morning', 'midnight is not evening');

const jul30 = new Date(2026, 6, 30);
assert.equal(relativeDate('2026-07-30 08:00', jul30), 'Today', 'a timestamp still reads as today');
assert.equal(relativeDate('2026-07-29', jul30), 'Yesterday');
assert.equal(relativeDate('2026-01-16', jul30), 'Jan 16, 2026');
assert.equal(
  relativeDate('2026-06-30', new Date(2026, 6, 1)),
  'Yesterday',
  'yesterday across a month boundary'
);

// Period bucketing behind the Day/Week/Month/Year tabs.
// Thu 2026-07-30 is the reference "now"; its Monday is 2026-07-27.
const spend = [
  { date: '2026-07-30 09:00', amount: 100 },
  { date: '2026-07-29', amount: 40 },
  { date: '2026-07-27', amount: 7 },
  { date: '2026-07-26', amount: 500 }, // Sunday — previous week
  { date: '2026-06-15', amount: 60 },
  { date: '2025-03-02', amount: 900 },
];

const days = bucketise(spend, 'Day', jul30);
assert.equal(days.length, 7);
assert.equal(days[6].value, 100, 'today is the last bucket');
assert.equal(days[5].value, 40, 'yesterday sits one bucket back');
assert.equal(days[0].label, 'Fri', 'seven days back from Thursday is Friday');

const weeks = bucketise(spend, 'Week', jul30);
assert.equal(weeks[5].value, 147, 'Mon-Thu of this week: 100 + 40 + 7');
assert.equal(weeks[4].value, 500, 'Sunday belongs to the previous week');

const monthBuckets = bucketise(spend, 'Month', jul30);
assert.equal(monthBuckets[5].value, 647, 'July total');
assert.equal(monthBuckets[4].value, 60, 'June total');
assert.equal(monthBuckets[5].label, 'Jul');

const years = bucketise(spend, 'Year', jul30);
assert.equal(years[2].value, 707, '2026 rolls up July and June');
assert.equal(years[1].value, 900, '2025');
assert.equal(years[0].value, 0, 'a year with nothing in it still gets a bucket');

assert.equal(
  bucketise([], 'Month', jul30).length,
  6,
  'empty input still returns a full set of buckets'
);

// Stepping back from a 31-day month used to overflow short months: Jul 30 minus 5
// became Mar 2, dropping February and charting March twice.
for (const day of [28, 29, 30, 31]) {
  for (const period of ['Day', 'Week', 'Month', 'Year'] as const) {
    const labels = bucketise([], period, new Date(2026, 6, day)).map((b) => b.label);
    assert.equal(
      new Set(labels).size,
      labels.length,
      `${period} buckets from Jul ${day} must all be distinct, got ${labels.join()}`
    );
  }
}
assert.deepEqual(
  bucketise([], 'Month', new Date(2026, 6, 31)).map((b) => b.label),
  ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  'six months back from Jan 31-style dates still walks one month at a time'
);

// Typewriter across two lines — the closing name must survive to the very last char.
for (const note of [
  ['Fabiha loves you,', 'Minhal'],
  ['Minhal loves you,', 'Fabiha'],
]) {
  const full = note.join(' ');
  assert.deepEqual(revealLines(note, 0), ['', ''], 'nothing shown at zero');
  assert.deepEqual(revealLines(note, note[0].length), [note[0], ''], 'first line completes alone');
  assert.deepEqual(
    revealLines(note, note[0].length + 1),
    [note[0], ''],
    'the joining space is consumed, not printed'
  );
  assert.deepEqual(
    revealLines(note, note[0].length + 2),
    [note[0], note[1][0]],
    'second line starts on the next character'
  );
  assert.deepEqual(
    revealLines(note, full.length),
    note,
    `both lines are whole at the end of "${full}"`
  );
  assert.equal(revealLines(note, full.length).join(' '), full, 'reveal rebuilds the message');
}

// Graph analysis reads whichever months are on the chart.
const text = (rows: Parameters<typeof analyse>[0]) => analyse(rows).map((i) => i.text).join(' | ');

assert.deepEqual(analyse([]), [], 'no months on screen, nothing to say');

// June 100 earned / 40 spent, July 50 earned / 70 spent / 25 invested.
const read = analyse(months);
assert.match(read[0].text, /Kept 27%/, '(60 - 20) saved out of 150 earned');
assert.equal(read[0].tone, 'good', 'over 20% kept reads as good');
assert.match(text(months), /Spending rose 75% from Jun 26 to Jul 26/, '40 -> 70');
assert.match(text(months), /Jul 26 spent more than earned/, 'a negative saving month is called out');
assert.match(text(months), /Jul 26 was the heaviest month at 70 — 64%/, '70 of 110 spent');
assert.match(text(months), /25 went into investments, 17% of earnings/);
assert.match(
  analyse(months, (n) => `Rs ${n}`)[0].text,
  /Rs 40 out of Rs 150/,
  'the caller owns money formatting'
);

assert.match(text([months[0]]), /Jun 26 saved the most/, 'no deficit means a best month instead');
assert.equal(
  text([months[0]]).includes('Spending'),
  false,
  'one month alone has nothing to compare against'
);

// A month with no earnings must not divide by zero.
const dry = [{ month: '2026-08', label: 'Aug 26', earning: 0, expense: 0, investment: 0, saving: 0 }];
assert.equal(text(dry), 'Aug 26 saved the most at 0.', 'empty month yields one safe line');

console.log('ok — all checks passed');
