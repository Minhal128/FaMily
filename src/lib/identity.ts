import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileId } from '../types';

// ponytail: one key per device — first unlock picks Minhal/Fabiha, forever after.
const KEY = '@family/who';

export async function loadWho(): Promise<ProfileId | null> {
  const v = await AsyncStorage.getItem(KEY);
  return v === 'you' || v === 'partner' ? v : null;
}

export async function saveWho(id: ProfileId): Promise<void> {
  await AsyncStorage.setItem(KEY, id);
}
