'use client';

import type { FoodEntry } from '@/types';
import { RecentMealItem } from './RecentMealItem';

interface RecentMealsProps {
  entries: FoodEntry[];
  onSelect?: (entry: FoodEntry) => void;
}

export function RecentMeals({ entries, onSelect }: RecentMealsProps) {
  const recent = entries.slice(0, 5);

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">Останні прийоми їжі</h2>
      {recent.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 bg-card/50 p-4 text-center text-sm text-muted-foreground">
          Ще немає записів. Додайте першу страву
        </p>
      ) : (
        <div className="space-y-2">
          {recent.map((entry) => (
            <RecentMealItem key={entry.id} entry={entry} onClick={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}
