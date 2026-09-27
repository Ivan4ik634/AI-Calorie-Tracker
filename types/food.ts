export interface FoodEntry {
  id: string;
  name: string;
  /** Values for the actual eaten portion (derived from per-100g × grams). */
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  grams?: number;
  /** Per-100g source values, used to rescale when grams change. */
  caloriesPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbsPer100g?: number;
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
  weight_g: number;
  calories_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  carbs_per_100g: number;
}

export type FoodAnalysisStatus =
  | 'idle'
  | 'selecting'
  | 'preview'
  | 'analyzing'
  | 'success'
  | 'not-food'
  | 'error';
