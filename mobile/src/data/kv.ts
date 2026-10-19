// Key-value storage on MMKV (synchronous, memory-mapped). Exposes the same promise API the app
// used with AsyncStorage, and moves each key across from AsyncStorage the first time it's read.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV({ id: 'exampilot' });
const MIGRATED = '__migrated_from_async_storage';

async function migrate(key: string): Promise<string | null> {
  const done: string[] = JSON.parse(mmkv.getString(MIGRATED) ?? '[]');
  if (done.includes(key)) return null;
  const old = await AsyncStorage.getItem(key).catch(() => null);
  if (old != null) mmkv.set(key, old);
  mmkv.set(MIGRATED, JSON.stringify([...done, key]));
  if (old != null) AsyncStorage.removeItem(key).catch(() => {});
  return old;
}

export const kv = {
  /** Synchronous read, for values needed before first render. */
  getSync: (key: string) => mmkv.getString(key) ?? null,
  getItem: async (key: string) => mmkv.getString(key) ?? (await migrate(key)),
  setItem: async (key: string, value: string) => {
    mmkv.set(key, value);
  },
  removeItem: async (key: string) => {
    mmkv.remove(key);
  },
};
