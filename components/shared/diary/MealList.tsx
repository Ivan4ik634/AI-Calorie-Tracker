'use client';

import { MEAL_LABELS, MEAL_ORDER, getMealType } from '@/lib/date';
import type { FoodEntry } from '@/types';
import { MealItem } from './MealItem';

interface MealListProps {
  entries: FoodEntry[];
  onSelect?: (entry: FoodEntry) => void;
}

export function MealList({ entries, onSelect }: MealListProps) {
  const groups = MEAL_ORDER.map((type) => {
    const items = entries.filter((entry) => getMealType(entry.createdAt) === type);
    const calories = items
      .filter((entry) => entry.eaten)
      .reduce((total, entry) => total + entry.calories, 0);
    return { type, items, calories };
  });

  return (
    <div className="space-y-3">
      {groups.map(({ type, items, calories }) => (
        <section key={type} className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{MEAL_LABELS[type]}</h2>
            <span className="text-xs text-muted-foreground">{calories} ккал</span>
          </div>
          {items.length === 0 ? (
            <p className="pt-2 text-xs text-muted-foreground">Немає доданих продуктів</p>
          ) : (
            <div className="divide-y divide-border/50">
              {items.map((entry) => (
                <MealItem key={entry.id} entry={entry} onClick={onSelect} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
