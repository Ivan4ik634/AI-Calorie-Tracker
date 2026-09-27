import type { FoodAnalysis } from '@/types';

/**
 * Provider-agnostic contract. The UI only depends on this signature,
 * so a real AI provider can be swapped in without touching components.
 */
export type AnalyzeFood = (image: string) => Promise<FoodAnalysis>;

const MOCK_RESULTS: FoodAnalysis[] = [
  { name: 'Вівсянка з бананом', calories: 328, protein: 12, fat: 6, carbs: 56, grams: 350 },
  { name: 'Курка з рисом', calories: 512, protein: 42, fat: 14, carbs: 48, grams: 400 },
  { name: 'Салат з овочів', calories: 180, protein: 5, fat: 9, carbs: 18, grams: 250 },
  { name: 'Яєчня з томатами', calories: 265, protein: 18, fat: 19, carbs: 6, grams: 220 },
  { name: 'Грецький йогурт', calories: 146, protein: 15, fat: 4, carbs: 12, grams: 170 },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock implementation. Simulates network latency and returns a plausible
 * analysis result. Replace with a real provider call later.
 */
export const analyzeFood: AnalyzeFood = async () => {
  await delay(1800);

  const result = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
  return { ...result };
};
