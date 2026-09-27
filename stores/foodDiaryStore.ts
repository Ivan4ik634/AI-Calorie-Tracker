import { foodDiaryStorage } from '@/services/storage/foodDiaryStorage';
import type { FoodEntry } from '@/types';
import { create } from 'zustand';

interface FoodDiaryState {
  entries: FoodEntry[];
  hydrated: boolean;
  hydrate: () => void;
  addEntry: (entry: Omit<FoodEntry, 'id' | 'createdAt'>) => void;
  updateEntry: (id: string, partial: Partial<Omit<FoodEntry, 'id' | 'createdAt'>>) => void;
  removeEntry: (id: string) => void;
  clear: () => void;
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useFoodDiaryStore = create<FoodDiaryState>((set, get) => ({
  entries: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    set({ entries: foodDiaryStorage.load(), hydrated: true });
  },

  addEntry: (entry) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    const entries = [newEntry, ...get().entries];
    foodDiaryStorage.save(entries);
    set({ entries });
  },

  updateEntry: (id, partial) => {
    const entries = get().entries.map((entry) =>
      entry.id === id ? { ...entry, ...partial } : entry,
    );
    foodDiaryStorage.save(entries);
    set({ entries });
  },

  removeEntry: (id) => {
    const entries = get().entries.filter((entry) => entry.id !== id);
    foodDiaryStorage.save(entries);
    set({ entries });
  },

  clear: () => {
    foodDiaryStorage.save([]);
    set({ entries: [] });
  },
}));
