import { useFoodDiaryStore } from '@/stores/foodDiaryStore';
import { useGoalsStore } from '@/stores/goalsStore';
import { useMemo } from 'react';

export function useFoodDiary() {
  const entries = useFoodDiaryStore((state) => state.entries);
  const addEntry = useFoodDiaryStore((state) => state.addEntry);
  const updateEntry = useFoodDiaryStore((state) => state.updateEntry);
  const removeEntry = useFoodDiaryStore((state) => state.removeEntry);
  const goals = useGoalsStore((state) => state.goals);

  const totals = useMemo(
    () =>
      entries
        .filter((entry) => entry.eaten)
        .reduce(
          (acc, entry) => ({
            calories: acc.calories + entry.calories,
            protein: acc.protein + entry.protein,
            fat: acc.fat + entry.fat,
            carbs: acc.carbs + entry.carbs,
          }),
          { calories: 0, protein: 0, fat: 0, carbs: 0 },
        ),
    [entries],
  );

  const progress = useMemo(
    () => ({
      calories: goals.calories ? totals.calories / goals.calories : 0,
      protein: goals.protein ? totals.protein / goals.protein : 0,
      fat: goals.fat ? totals.fat / goals.fat : 0,
      carbs: goals.carbs ? totals.carbs / goals.carbs : 0,
    }),
    [totals, goals],
  );

  return { entries, totals, goals, progress, addEntry, updateEntry, removeEntry };
}
