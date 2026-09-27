'use client';

import type { LucideIcon } from 'lucide-react';
import { Droplet, Flame, Wheat } from 'lucide-react';

interface MacroCardsProps {
  protein: number;
  fat: number;
  carbs: number;
  goals: { protein: number; fat: number; carbs: number };
}

interface MacroConfig {
  key: 'protein' | 'fat' | 'carbs';
  label: string;
  icon: LucideIcon;
  color: string;
}

const MACROS: MacroConfig[] = [
  { key: 'protein', label: 'Білки', icon: Flame, color: 'text-emerald-400' },
  { key: 'fat', label: 'Жири', icon: Droplet, color: 'text-amber-400' },
  { key: 'carbs', label: 'Вуглеводи', icon: Wheat, color: 'text-violet-400' },
];

export function MacroCards({ protein, fat, carbs, goals }: MacroCardsProps) {
  const values = { protein, fat, carbs };

  return (
    <div className="grid grid-cols-3 gap-3">
      {MACROS.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-3">
          <Icon className={`size-5 ${color}`} />
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold leading-tight">{values[key]} г</p>
            <p className="text-[11px] text-muted-foreground">з {goals[key]} г</p>
          </div>
        </div>
      ))}
    </div>
  );
}
