'use client';

import { GOAL_LABELS } from '@/lib/profile';
import type { GoalType } from '@/types';
import { Pencil, Settings } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  goalType: GoalType;
  onEditName: () => void;
  onOpenSettings: () => void;
}

export function ProfileHeader({ name, goalType, onEditName, onOpenSettings }: ProfileHeaderProps) {
  return (
    <header className="flex items-center gap-3">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-9">
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-bold">{name}</p>
        <p className="text-sm text-muted-foreground">Ціль: {GOAL_LABELS[goalType].toLowerCase()}</p>
      </div>
      <button
        type="button"
        aria-label="Редагувати ім'я"
        onClick={onEditName}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
        <Pencil className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Налаштування"
        onClick={onOpenSettings}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
        <Settings className="size-5" />
      </button>
    </header>
  );
}
