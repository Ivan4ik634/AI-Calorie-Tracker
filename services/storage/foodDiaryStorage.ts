import type { FoodEntry } from '@/types';
import { idbGet, idbSet } from './indexedDb';
import { readJson, removeKey } from './localStorage';

const FOOD_DIARY_KEY = 'calorie-counter:food-entries';
const IDB_KEY = 'food-entries';

/** Migrate entries saved before the `eaten` flag existed. */
function migrate(entries: Partial<FoodEntry>[]): FoodEntry[] {
  return entries.map((entry) => ({
    ...entry,
    eaten: entry.eaten ?? true,
  })) as FoodEntry[];
}

export const foodDiaryStorage = {
  async load(): Promise<FoodEntry[]> {
    try {
      const stored = await idbGet<Partial<FoodEntry>[]>(IDB_KEY);
      if (stored) return migrate(stored);

      // One-time migration from the old localStorage storage.
      const legacy = readJson<Partial<FoodEntry>[] | null>(FOOD_DIARY_KEY, null);
      if (legacy && legacy.length > 0) {
        const entries = migrate(legacy);
        await idbSet(IDB_KEY, entries);
        removeKey(FOOD_DIARY_KEY);
        return entries;
      }

      return [];
    } catch {
      // Fallback to localStorage if IndexedDB is unavailable.
      return migrate(readJson<Partial<FoodEntry>[]>(FOOD_DIARY_KEY, []));
    }
  },

  /** Returns false when the write fails (e.g. storage unavailable). */
  async save(entries: FoodEntry[]): Promise<boolean> {
    try {
      await idbSet(IDB_KEY, entries);
      return true;
    } catch {
      return false;
    }
  },
};
