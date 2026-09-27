import type { FoodAnalysis } from '@/types';

/**
 * Provider-agnostic contract. The UI only depends on this signature,
 * so a real AI provider can be swapped in without touching components.
 */
export type AnalyzeFood = (image: string) => Promise<FoodAnalysis>;

/**
 * Thrown when the AI cannot recognize any food in the image.
 * The UI uses this to show a dedicated "not food" screen instead of
 * the regular analysis result.
 */
export class NotFoodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoodError';
  }
}

/**
 * Sends the image to the backend route, which asks the AI for per-100g
 * values plus the visible portion weight, then scales them to the actual
 * portion (weight_g / 100) before returning the result.
 */
export const analyzeFood: AnalyzeFood = async (image) => {
  const response = await fetch('/api/analyze-food', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image }),
  });

  const data = await response.json();

  if (!response.ok || data?.error) {
    throw new Error(data?.error ?? 'Не вдалося проаналізувати фото.');
  }

  if (data.food_detected === false) {
    throw new NotFoodError(data.message ?? 'На фото не схоже на їжу.');
  }

  return data as FoodAnalysis;
};
