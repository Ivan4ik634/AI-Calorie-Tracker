import type { DailyGoals } from '@/types';
import { readJson, writeJson } from './localStorage';

const GOALS_KEY = 'calorie-counter:daily-goals';

export const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  protein: 150,
  fat: 70,
  carbs: 250,
};

export const goalsStorage = {
  load(): DailyGoals {
    return readJson<DailyGoals>(GOALS_KEY, DEFAULT_GOALS);
  },
  save(goals: DailyGoals): void {
    writeJson(GOALS_KEY, goals);
  },
};
