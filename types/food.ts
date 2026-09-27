export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  grams?: number;
  eaten: boolean;
  image?: string;
  createdAt: string;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface FoodAnalysis {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  grams?: number;
}

export type FoodAnalysisStatus =
  | 'idle'
  | 'selecting'
  | 'preview'
  | 'analyzing'
  | 'success'
  | 'error';
