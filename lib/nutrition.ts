import type { FoodAnalysis, FoodEntry } from '@/types';

/** Nutrition values per 100 g — the source of truth for an analysed food. */
export interface NutritionPer100g {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** Nutrition values for the actual eaten portion. */
export interface PortionNutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** Editable nutrition state used by forms. When `per100g` is present,
 * changing `grams` rescales every value automatically. */
export interface EditableNutrition extends PortionNutrition {
  grams?: number;
  per100g?: NutritionPer100g;
}

const round1 = (value: number) => Math.round(value * 10) / 10;

/** Scale per-100g values to the portion weight (120 g -> ×1.2). */
export function calcPortion(per100g: NutritionPer100g, grams?: number): PortionNutrition {
  const multiplier = (grams ?? 0) / 100;
  return {
    calories: Math.round(per100g.calories * multiplier),
    protein: round1(per100g.protein * multiplier),
    fat: round1(per100g.fat * multiplier),
    carbs: round1(per100g.carbs * multiplier),
  };
}

/** Inverse of `calcPortion` — derive per-100g values from a portion. */
export function toPer100g(portion: PortionNutrition, grams?: number): NutritionPer100g {
  const multiplier = (grams ?? 0) / 100;
  if (!multiplier) return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  return {
    calories: portion.calories / multiplier,
    protein: portion.protein / multiplier,
    fat: portion.fat / multiplier,
    carbs: portion.carbs / multiplier,
  };
}

/** Build editable form state from an AI analysis (per-100g + weight). */
export function analysisToEditable(analysis: FoodAnalysis): EditableNutrition {
  const per100g: NutritionPer100g = {
    calories: analysis.calories_per_100g,
    protein: analysis.protein_per_100g,
    fat: analysis.fat_per_100g,
    carbs: analysis.carbs_per_100g,
  };
  return { ...calcPortion(per100g, analysis.weight_g), grams: analysis.weight_g, per100g };
}

/** Build editable form state from a stored diary entry. */
export function entryToEditable(entry: FoodEntry): EditableNutrition {
  const hasPer100g = entry.caloriesPer100g != null;
  const portion: PortionNutrition = {
    calories: entry.calories,
    protein: entry.protein,
    fat: entry.fat,
    carbs: entry.carbs,
  };

  let per100g: NutritionPer100g | undefined;
  if (hasPer100g) {
    per100g = {
      calories: entry.caloriesPer100g ?? 0,
      protein: entry.proteinPer100g ?? 0,
      fat: entry.fatPer100g ?? 0,
      carbs: entry.carbsPer100g ?? 0,
    };
  } else if (entry.grams) {
    // Legacy entry without per-100g values — derive them so the portion
    // still rescales when the user edits the weight.
    per100g = toPer100g(portion, entry.grams);
  }

  return { ...portion, grams: entry.grams, per100g };
}

/** Map editable form state back to a diary entry patch. */
export function editableToEntryPatch(
  values: EditableNutrition,
): Partial<Omit<FoodEntry, 'id' | 'createdAt'>> {
  const patch: Partial<Omit<FoodEntry, 'id' | 'createdAt'>> = {
    calories: values.calories,
    protein: values.protein,
    fat: values.fat,
    carbs: values.carbs,
    grams: values.grams,
  };

  if (values.per100g) {
    patch.caloriesPer100g = values.per100g.calories;
    patch.proteinPer100g = values.per100g.protein;
    patch.fatPer100g = values.per100g.fat;
    patch.carbsPer100g = values.per100g.carbs;
  }

  return patch;
}
