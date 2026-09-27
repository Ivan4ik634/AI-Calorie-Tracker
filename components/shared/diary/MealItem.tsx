'use client';

import { formatTime } from '@/lib/date';
import type { FoodEntry } from '@/types';
import { Utensils } from 'lucide-react';
import Image from 'next/image';

interface MealItemProps {
  entry: FoodEntry;
  onClick?: (entry: FoodEntry) => void;
}

export function MealItem({ entry, onClick }: MealItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(entry)}
      className="flex w-full items-center gap-3 py-2.5 text-left transition-opacity hover:opacity-80">
      <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
        {entry.image ? (
          <Image src={entry.image} alt={entry.name} fill unoptimized className="object-cover" />
        ) : (
          <Utensils className="size-5 text-muted-foreground" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{entry.name}</p>
        <p className="text-xs text-muted-foreground">
          {entry.calories} ккал · {formatTime(entry.createdAt)}
          {!entry.eaten && ' · не з\u2019їдено'}
        </p>
      </div>
    </button>
  );
}
