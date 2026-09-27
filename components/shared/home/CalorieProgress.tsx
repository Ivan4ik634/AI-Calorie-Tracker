'use client';

interface CalorieProgressProps {
  consumed: number;
  goal: number;
}

const SIZE = 200;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CalorieProgress({ consumed, goal }: CalorieProgressProps) {
  const ratio = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const offset = CIRCUMFERENCE * (1 - ratio);

  return (
    <div className="flex justify-center py-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">Запишилось</span>
          <span className="text-4xl font-bold tracking-tight">{consumed}</span>
          <span className="text-sm text-muted-foreground">з {goal}</span>
        </div>
      </div>
    </div>
  );
}
