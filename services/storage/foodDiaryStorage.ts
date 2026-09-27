import type { FoodEntry } from '@/types';
import { readJson, writeJson } from './localStorage';

const FOOD_DIARY_KEY = 'calorie-counter:food-entries';

export const foodDiaryStorage = {
  load(): FoodEntry[] {
    const stored = readJson<Partial<FoodEntry>[]>(FOOD_DIARY_KEY, []);
    // Migrate entries saved before the `eaten` flag existed.
    return stored.map((entry) => ({
      ...entry,
      eaten: entry.eaten ?? true,
    })) as FoodEntry[];
  },
  save(entries: FoodEntry[]): void {
    writeJson(FOOD_DIARY_KEY, entries);
  },
};
