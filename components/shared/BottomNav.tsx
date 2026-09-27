'use client';

import { cn } from '@/lib/utils';
import { BookOpen, ChartColumn, House, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Головна', icon: House },
  { id: 'diary', label: 'Щоденник', icon: BookOpen },
  { id: 'stats', label: 'Статистика', icon: ChartColumn },
  { id: 'profile', label: 'Профіль', icon: User },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]['id'];

interface BottomNavProps {
  active?: NavItemId;
  onNavigate?: (id: NavItemId) => void;
}

export function BottomNav({ active = 'home', onNavigate }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur-md">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate?.(id)}
                className={cn(
                  'flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}>
                <Icon className="size-5" strokeWidth={isActive ? 2.4 : 2} />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
