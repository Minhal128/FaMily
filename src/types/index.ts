export type ProfileId = 'you' | 'partner';

export type Profile = {
  id: ProfileId;
  name: string;
  initials: string;
};

export type IncomeType = 'Monthly' | 'One-time' | 'Milestone';

export type Income = {
  id: string;
  owner: ProfileId;
  source: string;
  type: IncomeType;
  /** YYYY-MM-DD */
  date: string;
  description: string;
  amount: number;
};

export type Expense = {
  id: string;
  owner: ProfileId;
  name: string;
  category: string;
  /** YYYY-MM-DD HH:mm */
  date: string;
  amount: number;
};

export type Investment = {
  id: string;
  owner: ProfileId;
  name: string;
  /** YYYY-MM-DD */
  date: string;
  note: string;
  amount: number;
};

export type Message = {
  id: string;
  sender: ProfileId;
  text: string;
  /** HH:mm */
  time: string;
};

/** YYYY-MM */
export type MonthKey = string;

export type MonthSummary = {
  month: MonthKey;
  label: string;
  earning: number;
  expense: number;
  investment: number;
  saving: number;
};
