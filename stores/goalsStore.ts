import { DEFAULT_GOALS, goalsStorage } from '@/services/storage/goalsStorage';
import type { DailyGoals } from '@/types';
import { create } from 'zustand';

interface GoalsState {
  goals: DailyGoals;
  hydrated: boolean;
  hydrate: () => void;
  setGoals: (goals: Partial<DailyGoals>) => void;
  reset: () => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: DEFAULT_GOALS,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    set({ goals: goalsStorage.load(), hydrated: true });
  },

  setGoals: (partial) => {
    const goals = { ...get().goals, ...partial };
    goalsStorage.save(goals);
    set({ goals });
  },

  reset: () => {
    goalsStorage.save(DEFAULT_GOALS);
    set({ goals: DEFAULT_GOALS });
  },
}));
