'use client';

import { Cell, Pie, PieChart } from 'recharts';

interface MacroDonutProps {
  protein: number;
  fat: number;
  carbs: number;
}

const COLORS = {
  protein: '#34d399',
  fat: '#fbbf24',
  carbs: '#a78bfa',
};

export function MacroDonut({ protein, fat, carbs }: MacroDonutProps) {
  const total = protein + fat + carbs;
  const data = [
    { key: 'protein', label: 'Білки', value: protein, color: COLORS.protein },
    { key: 'fat', label: 'Жири', value: fat, color: COLORS.fat },
    { key: 'carbs', label: 'Вуглеводи', value: carbs, color: COLORS.carbs },
  ];

  const percent = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0);

  return (
    <section className="space-y-4 rounded-2xl border border-border/60 bg-card p-4">
      <h2 className="text-sm font-semibold">Макронутрієнти</h2>
      <div className="flex items-center gap-4">
        {data.some((item) => item.value > 0) && (
          <div className="relative size-32 shrink-0">
            <PieChart width={128} height={128}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={40}
                outerRadius={62}
                paddingAngle={2}
                stroke="none">
                {data.map((item) => (
                  <Cell key={item.key} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        )}
        <ul className="flex-1 space-y-2">
          {data.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="flex-1 text-muted-foreground">{item.label}</span>
              <span className="font-semibold">{percent(item.value)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
