'use client';

import type { FoodEntry } from '@/types';
import { ChevronRight, Utensils } from 'lucide-react';
import Image from 'next/image';

interface RecentMealItemProps {
  entry: FoodEntry;
  onClick?: (entry: FoodEntry) => void;
}

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RecentMealItem({ entry, onClick }: RecentMealItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(entry)}
      className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 text-left transition-colors hover:bg-muted/40">
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
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </button>
  );
}
