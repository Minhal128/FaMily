import { Expense, Income, Investment, Message, Profile } from '../types';

const now = new Date();

const pad = (n: number) => String(n).padStart(2, '0');

/** Date `day` of the month `monthsAgo` months back, as YYYY-MM-DD (+ optional time). */
const d = (monthsAgo: number, day: number, time?: string) => {
  const dt = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
  const base = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  return time ? `${base} ${time}` : base;
};

export const profiles: Profile[] = [
  { id: 'you', name: 'Fabiha', initials: 'F' },
  { id: 'partner', name: 'Minhal', initials: 'M' },
];

export const CODE_WORD = 'family';

export const incomes: Income[] = [
  { id: 'i1', owner: 'you', source: 'Salary', type: 'Monthly', date: d(3, 1), description: 'Base pay', amount: 185000 },
  { id: 'i2', owner: 'you', source: 'Salary', type: 'Monthly', date: d(2, 1), description: 'Base pay', amount: 185000 },
  { id: 'i3', owner: 'you', source: 'Salary', type: 'Monthly', date: d(1, 1), description: 'Base pay', amount: 195000 },
  { id: 'i4', owner: 'you', source: 'Salary', type: 'Monthly', date: d(0, 1), description: 'Base pay + bonus', amount: 210000 },
  { id: 'i5', owner: 'you', source: 'Freelance', type: 'One-time', date: d(1, 14), description: 'Logo redesign', amount: 42000 },
  { id: 'i6', owner: 'you', source: 'Gift', type: 'One-time', date: d(0, 9), description: 'Eid money', amount: 15000 },
  { id: 'i7', owner: 'partner', source: 'Salary', type: 'Monthly', date: d(2, 3), description: 'Base pay', amount: 150000 },
  { id: 'i8', owner: 'partner', source: 'Salary', type: 'Monthly', date: d(1, 3), description: 'Base pay', amount: 150000 },
  { id: 'i9', owner: 'partner', source: 'Salary', type: 'Monthly', date: d(0, 3), description: 'Base pay', amount: 158000 },
  { id: 'i10', owner: 'partner', source: 'Freelance', type: 'One-time', date: d(2, 21), description: 'Weekend gig', amount: 28000 },
];

export const expenses: Expense[] = [
  { id: 'e1', owner: 'you', name: 'Groceries', category: 'Monthly kitchen run', date: d(3, 6, '18:40'), amount: 24500 },
  { id: 'e2', owner: 'you', name: 'Rent', category: 'Apartment', date: d(3, 2, '10:05'), amount: 65000 },
  { id: 'e3', owner: 'you', name: 'Rent', category: 'Apartment', date: d(2, 2, '10:12'), amount: 65000 },
  { id: 'e4', owner: 'you', name: 'Dinner out', category: 'Anniversary', date: d(2, 17, '21:30'), amount: 9800 },
  { id: 'e5', owner: 'you', name: 'Rent', category: 'Apartment', date: d(1, 2, '09:58'), amount: 65000 },
  { id: 'e6', owner: 'you', name: 'Groceries', category: 'Weekly top-up', date: d(1, 11, '17:20'), amount: 12300 },
  { id: 'e7', owner: 'you', name: 'Electricity', category: 'Utility bill', date: d(1, 19, '13:00'), amount: 18700 },
  { id: 'e8', owner: 'you', name: 'Rent', category: 'Apartment', date: d(0, 2, '10:02'), amount: 68000 },
  { id: 'e9', owner: 'you', name: 'Groceries', category: 'Weekly top-up', date: d(0, 8, '19:15'), amount: 14200 },
  { id: 'e10', owner: 'you', name: 'Pharmacy', category: 'Medicines', date: d(0, 15, '11:45'), amount: 4600 },
  { id: 'e11', owner: 'partner', name: 'Fuel', category: 'Car', date: d(2, 9, '08:30'), amount: 11000 },
  { id: 'e12', owner: 'partner', name: 'Internet', category: 'Utility bill', date: d(1, 5, '12:10'), amount: 6500 },
  { id: 'e13', owner: 'partner', name: 'Fuel', category: 'Car', date: d(1, 22, '08:15'), amount: 12500 },
  { id: 'e14', owner: 'partner', name: 'Gym', category: 'Membership', date: d(0, 4, '07:00'), amount: 8000 },
  { id: 'e15', owner: 'partner', name: 'Gadgets', category: 'New headphones', date: d(0, 12, '16:25'), amount: 21000 },
];

export const investments: Investment[] = [
  { id: 'v1', owner: 'you', name: 'Gold savings', date: d(2, 12), note: '2 tola plan', amount: 90000 },
  { id: 'v2', owner: 'you', name: 'Mutual fund', date: d(1, 8), note: 'Meezan Islamic', amount: 50000 },
  { id: 'v3', owner: 'you', name: 'Mutual fund', date: d(0, 6), note: 'Monthly top-up', amount: 25000 },
  { id: 'v4', owner: 'partner', name: 'Stocks', date: d(1, 16), note: 'Blue chip basket', amount: 40000 },
  { id: 'v5', owner: 'partner', name: 'Gold savings', date: d(0, 10), note: 'Joint plan', amount: 30000 },
];

export const messages: Message[] = [
  { id: 'm1', sender: 'partner', text: 'Added the rent for this month, check the amount?', time: '09:14' },
  { id: 'm2', sender: 'you', text: 'Saw it — landlord raised it by 3k, so 68 is right.', time: '09:16' },
  { id: 'm3', sender: 'partner', text: 'Got it. Also the headphones were on sale, 21k not 26k.', time: '09:18' },
  { id: 'm4', sender: 'you', text: 'Nice. I fixed the entry.', time: '09:20' },
  { id: 'm5', sender: 'partner', text: "Let's keep eating out under 10k this month 🙂", time: '09:22' },
];
