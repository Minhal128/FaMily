import React, { createContext, useContext, useMemo, useState } from 'react';
import { summarize, sum } from '../lib/summary';
import * as seed from '../mock';
import { Expense, Income, Investment, Message, MonthSummary, Profile, ProfileId } from '../types';

type Draft<T> = Omit<T, 'id' | 'owner'>;

type AppState = {
  profileId: ProfileId;
  setProfileId: (id: ProfileId) => void;
  profile: Profile;
  partner: Profile;

  /** All lists are already filtered to the profile being viewed. */
  incomes: Income[];
  expenses: Expense[];
  investments: Investment[];
  messages: Message[];

  addIncome: (draft: Draft<Income>) => void;
  addExpense: (draft: Draft<Expense>) => void;
  addInvestment: (draft: Draft<Investment>) => void;
  sendMessage: (text: string) => void;

  totalEarning: number;
  totalExpense: number;
  totalInvestment: number;
  /** Card balance: money in minus money spent. Investments are tracked separately. */
  balance: number;
  months: MonthSummary[];
};

const AppContext = createContext<AppState | null>(null);

let nextId = 0;
const id = () => `local-${nextId++}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profileId, setProfileId] = useState<ProfileId>('you');
  const [incomes, setIncomes] = useState(seed.incomes);
  const [expenses, setExpenses] = useState(seed.expenses);
  const [investments, setInvestments] = useState(seed.investments);
  const [messages, setMessages] = useState(seed.messages);

  const value = useMemo<AppState>(() => {
    const mine = <T extends { owner: ProfileId }>(items: T[]) =>
      items.filter((i) => i.owner === profileId);

    const myIncomes = mine(incomes);
    const myExpenses = mine(expenses);
    const myInvestments = mine(investments);

    const totalEarning = sum(myIncomes);
    const totalExpense = sum(myExpenses);

    return {
      profileId,
      setProfileId,
      profile: seed.profiles.find((p) => p.id === profileId)!,
      partner: seed.profiles.find((p) => p.id !== profileId)!,
      incomes: myIncomes,
      expenses: myExpenses,
      investments: myInvestments,
      messages,
      addIncome: (draft) =>
        setIncomes((prev) => [{ ...draft, id: id(), owner: profileId }, ...prev]),
      addExpense: (draft) =>
        setExpenses((prev) => [{ ...draft, id: id(), owner: profileId }, ...prev]),
      addInvestment: (draft) =>
        setInvestments((prev) => [{ ...draft, id: id(), owner: profileId }, ...prev]),
      sendMessage: (text) =>
        setMessages((prev) => [
          ...prev,
          {
            id: id(),
            sender: profileId,
            text,
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          },
        ]),
      totalEarning,
      totalExpense,
      totalInvestment: sum(myInvestments),
      balance: totalEarning - totalExpense,
      months: summarize(myIncomes, myExpenses, myInvestments),
    };
  }, [profileId, incomes, expenses, investments, messages]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
