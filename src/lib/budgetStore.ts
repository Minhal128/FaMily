import { ProfileId } from '../types';
import { api } from './api';
import { MonthBudget } from './budget';

/** Server is source of truth — both phones see the same plan. */
export async function loadBudget(owner: ProfileId, month: string): Promise<MonthBudget | null> {
  const doc = await api.getBudget(owner, month);
  if (!doc) return null;
  return { total: doc.total, events: doc.events ?? [] };
}

export async function saveBudget(
  owner: ProfileId,
  month: string,
  budget: MonthBudget
): Promise<MonthBudget> {
  const doc = await api.putBudget({ owner, month, total: budget.total, events: budget.events });
  return { total: doc.total, events: doc.events ?? [] };
}

export async function clearBudget(owner: ProfileId, month: string): Promise<void> {
  await api.deleteBudget(owner, month);
}
