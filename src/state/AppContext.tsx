import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { loadWho, saveWho } from '../lib/identity';
import { summarize, sum } from '../lib/summary';
import * as seed from '../mock';
import { Expense, Income, Investment, Message, MonthSummary, Profile, ProfileId } from '../types';

type Draft<T> = Omit<T, 'id' | 'owner'>;

type AppState = {
  profileId: ProfileId;
  setProfileId: (id: ProfileId) => void;
  /** First-time pick: locks this phone to Minhal or Fabiha. */
  claimIdentity: (id: ProfileId) => Promise<void>;
  profile: Profile;
  partner: Profile;
  profiles: Profile[];

  /** Unlocks with the shared code word. Throws with the server's message on a bad code. */
  unlock: (code: string) => Promise<void>;

  /** Everything below belongs to the profile being viewed — the server filters by owner. */
  incomes: Income[];
  expenses: Expense[];
  investments: Investment[];
  messages: Message[];

  loading: boolean;
  /** Set when the last load failed, so screens can say so instead of showing zeroes. */
  error: string;
  reload: () => void;

  addIncome: (draft: Draft<Income>) => Promise<void>;
  addExpense: (draft: Draft<Expense>) => Promise<void>;
  addInvestment: (draft: Draft<Investment>) => Promise<void>;
  updateIncome: (id: string, draft: Draft<Income>) => Promise<void>;
  updateExpense: (id: string, draft: Draft<Expense>) => Promise<void>;
  updateInvestment: (id: string, draft: Draft<Investment>) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  sendMessage: (text: string) => void;

  totalEarning: number;
  totalExpense: number;
  totalInvestment: number;
  /** Card balance: money in minus money spent. Investments are tracked separately. */
  balance: number;
  months: MonthSummary[];
};

const AppContext = createContext<AppState | null>(null);

const EMPTY = { incomes: [] as Income[], expenses: [] as Expense[], investments: [] as Investment[] };

/** Stands in until login returns the real names, so nothing renders undefined. */
const blank = (id: ProfileId): Profile => ({ id, name: '', initials: '' });

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profileId, setProfileId] = useState<ProfileId>('you');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloads, setReloads] = useState(0);
  const [messages, setMessages] = useState(seed.messages);

  const unlocked = profiles.length > 0;

  // Restore the phone's locked identity before the first entries fetch.
  useEffect(() => {
    loadWho().then((who) => {
      if (who) setProfileId(who);
    });
  }, []);

  // Refetch whenever you switch whose numbers you're looking at.
  useEffect(() => {
    if (!unlocked) return;
    let live = true;

    setLoading(true);
    api
      .entries(profileId)
      .then((entries) => {
        if (!live) return;
        setData(entries);
        setError('');
      })
      .catch((err: Error) => live && setError(err.message))
      .finally(() => live && setLoading(false));

    return () => {
      live = false;
    };
  }, [profileId, unlocked, reloads]);

  const value = useMemo<AppState>(() => {
    const { incomes, expenses, investments } = data;
    const totalEarning = sum(incomes);
    const totalExpense = sum(expenses);

    return {
      profileId,
      setProfileId,
      claimIdentity: async (id) => {
        await saveWho(id);
        setProfileId(id);
      },
      profiles,
      profile: profiles.find((p) => p.id === profileId) ?? blank(profileId),
      partner: profiles.find((p) => p.id !== profileId) ?? blank(profileId === 'you' ? 'partner' : 'you'),

      unlock: async (code) => setProfiles(await api.login(code)),

      incomes,
      expenses,
      investments,
      messages,
      loading,
      error,
      reload: () => setReloads((n) => n + 1),

      addIncome: async (draft) => {
        const income = await api.addIncome({ ...draft, owner: profileId });
        setData((d) => ({ ...d, incomes: [income, ...d.incomes] }));
      },
      addExpense: async (draft) => {
        const expense = await api.addExpense({ ...draft, owner: profileId });
        setData((d) => ({ ...d, expenses: [expense, ...d.expenses] }));
      },
      addInvestment: async (draft) => {
        const investment = await api.addInvestment({ ...draft, owner: profileId });
        setData((d) => ({ ...d, investments: [investment, ...d.investments] }));
      },

      updateIncome: async (id, draft) => {
        const income = await api.updateIncome(id, { ...draft, owner: profileId });
        setData((d) => ({
          ...d,
          incomes: d.incomes.map((i) => (i.id === id ? income : i)),
        }));
      },
      updateExpense: async (id, draft) => {
        const expense = await api.updateExpense(id, { ...draft, owner: profileId });
        setData((d) => ({
          ...d,
          expenses: d.expenses.map((e) => (e.id === id ? expense : e)),
        }));
      },
      updateInvestment: async (id, draft) => {
        const investment = await api.updateInvestment(id, { ...draft, owner: profileId });
        setData((d) => ({
          ...d,
          investments: d.investments.map((i) => (i.id === id ? investment : i)),
        }));
      },

      deleteIncome: async (id) => {
        await api.deleteIncome(id);
        setData((d) => ({ ...d, incomes: d.incomes.filter((i) => i.id !== id) }));
      },
      deleteExpense: async (id) => {
        await api.deleteExpense(id);
        setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
      },
      deleteInvestment: async (id) => {
        await api.deleteInvestment(id);
        setData((d) => ({ ...d, investments: d.investments.filter((i) => i.id !== id) }));
      },

      // ponytail: chat is still local-only — the backend deliberately has no messages.
      sendMessage: (text) =>
        setMessages((prev) => [
          ...prev,
          {
            id: `local-${prev.length}`,
            sender: profileId,
            text,
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          },
        ]),

      totalEarning,
      totalExpense,
      totalInvestment: sum(investments),
      balance: totalEarning - totalExpense,
      months: summarize(incomes, expenses, investments),
    };
  }, [profileId, profiles, data, messages, loading, error]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
