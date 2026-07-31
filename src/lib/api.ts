import { Expense, Income, Investment, Profile, ProfileId } from '../types';

const BASE = process.env.EXPO_PUBLIC_API_URL;

/** Set by login and kept in memory — you unlock again every cold start anyway. */
let token = '';

type Draft<T> = Omit<T, 'id'>;

async function call<T>(path: string, body?: object, method = 'GET'): Promise<T> {
  if (!BASE) throw new Error('EXPO_PUBLIC_API_URL is not set — check .env and restart Expo.');

  const res = await fetch(`${BASE}/api${path}`, {
    method: body ? 'POST' : method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : null),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: '' }));
    throw new Error(error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? (null as T) : res.json();
}

export const api = {
  /** Unlocks with the shared code word and remembers the token for later calls. */
  async login(code: string) {
    const res = await call<{ token: string; profiles: Profile[] }>('/login', { code });
    token = res.token;
    return res.profiles;
  },

  entries: (owner: ProfileId) =>
    call<{ incomes: Income[]; expenses: Expense[]; investments: Investment[] }>(
      `/entries?owner=${owner}`
    ),

  addIncome: (income: Draft<Income>) => call<Income>('/incomes', income),
  addExpense: (expense: Draft<Expense>) => call<Expense>('/expenses', expense),
  addInvestment: (investment: Draft<Investment>) => call<Investment>('/investments', investment),
};
