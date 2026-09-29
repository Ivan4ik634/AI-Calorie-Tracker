import { foodDiaryStorage } from '@/services/storage/foodDiaryStorage';
import type { FoodEntry } from '@/types';
import { create } from 'zustand';

interface FoodDiaryState {
  entries: FoodEntry[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addEntry: (entry: Omit<FoodEntry, 'id' | 'createdAt'>) => Promise<boolean>;
  updateEntry: (
    id: string,
    partial: Partial<Omit<FoodEntry, 'id' | 'createdAt'>>,
  ) => Promise<boolean>;
  removeEntry: (id: string) => Promise<void>;
  clear: () => Promise<void>;
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useFoodDiaryStore = create<FoodDiaryState>((set, get) => ({
  entries: [],
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    const entries = await foodDiaryStorage.load();
    set({ entries, hydrated: true });
  },

  addEntry: async (entry) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    const entries = [newEntry, ...get().entries];
    // Keep the entry in memory even if persistence failed, so the user does
    // not lose what they just added; the caller surfaces the warning.
    set({ entries });
    return foodDiaryStorage.save(entries);
  },

  updateEntry: async (id, partial) => {
    const entries = get().entries.map((entry) =>
      entry.id === id ? { ...entry, ...partial } : entry,
    );
    set({ entries });
    return foodDiaryStorage.save(entries);
  },

  removeEntry: async (id) => {
    const entries = get().entries.filter((entry) => entry.id !== id);
    set({ entries });
    await foodDiaryStorage.save(entries);
  },

  clear: async () => {
    set({ entries: [] });
    await foodDiaryStorage.save([]);
  },
}));
