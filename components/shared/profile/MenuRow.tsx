'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface MenuRowProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  destructive?: boolean;
}

export function MenuRow({ icon: Icon, label, onClick, destructive }: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:opacity-80">
      <Icon
        className={cn(
          'size-5 shrink-0',
          destructive ? 'text-destructive' : 'text-muted-foreground',
        )}
      />
      <span className={cn('flex-1 text-sm font-medium', destructive && 'text-destructive')}>
        {label}
      </span>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </button>
  );
}
