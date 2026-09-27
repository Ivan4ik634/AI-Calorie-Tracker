'use client';

import { BottomNav } from '@/components/shared/BottomNav';
import { useFoodDiary } from '@/hooks/useFoodDiary';
import { WEEKDAY_SHORT, dayjs, formatRangeLabel, getWeekDays, isSameDay } from '@/lib/date';
import { useFoodDiaryStore } from '@/stores/foodDiaryStore';
import { useGoalsStore } from '@/stores/goalsStore';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AverageCard } from './AverageCard';
import type { ChartPoint } from './CaloriesChart';
import { CaloriesChart } from './CaloriesChart';
import { MacroDonut } from './MacroDonut';
import { PeriodNavigator } from './PeriodNavigator';
import type { StatsPeriod } from './PeriodTabs';
import { PeriodTabs } from './PeriodTabs';

export default function StatsPage() {
  const router = useRouter();
  const { entries } = useFoodDiary();
  const hydrateDiary = useFoodDiaryStore((state) => state.hydrate);
  const hydrateGoals = useGoalsStore((state) => state.hydrate);

  const [period, setPeriod] = useState<StatsPeriod>('week');
  const [anchor, setAnchor] = useState(() => new Date());

  useEffect(() => {
    hydrateDiary();
    hydrateGoals();
  }, [hydrateDiary, hydrateGoals]);

  const eatenEntries = useMemo(() => entries.filter((entry) => entry.eaten), [entries]);

  const { points, rangeLabel, periodEntries } = useMemo(() => {
    const base = dayjs(anchor);
    let points: ChartPoint[] = [];
    let start = base;
    let end = base;

    if (period === 'week') {
      const days = getWeekDays(anchor);
      start = days[0];
      end = days[6];
      points = days.map((day, index) => ({
        label: WEEKDAY_SHORT[index],
        sublabel: day.format('D'),
        value: eatenEntries
          .filter((entry) => isSameDay(entry.createdAt, day))
          .reduce((total, entry) => total + entry.calories, 0),
      }));
    } else if (period === 'month') {
      start = base.startOf('month');
      end = base.endOf('month');
      const weeks = Math.ceil(end.date() / 7);
      points = Array.from({ length: weeks }, (_, index) => {
        const weekStart = start.add(index * 7, 'day');
        const weekEnd = weekStart.add(6, 'day');
        return {
          label: `${weekStart.format('D')}`,
          sublabel: weekEnd.format('D'),
          value: eatenEntries
            .filter((entry) => {
              const date = dayjs(entry.createdAt);
              return (
                (date.isSame(weekStart, 'day') || date.isAfter(weekStart, 'day')) &&
                (date.isSame(weekEnd, 'day') || date.isBefore(weekEnd, 'day'))
              );
            })
            .reduce((total, entry) => total + entry.calories, 0),
        };
      });
    } else {
      start = base.startOf('year');
      end = base.endOf('year');
      points = Array.from({ length: 12 }, (_, index) => {
        const month = start.add(index, 'month');
        return {
          label: month.format('MMM'),
          value: eatenEntries
            .filter((entry) => dayjs(entry.createdAt).isSame(month, 'month'))
            .reduce((total, entry) => total + entry.calories, 0),
        };
      });
    }

    const periodEntries = eatenEntries.filter((entry) => {
      const date = dayjs(entry.createdAt);
      return (
        (date.isSame(start, 'day') || date.isAfter(start, 'day')) &&
        (date.isSame(end, 'day') || date.isBefore(end, 'day'))
      );
    });

    return {
      points,
      rangeLabel: formatRangeLabel(start, end),
      periodEntries,
    };
  }, [anchor, eatenEntries, period]);

  const average = useMemo(() => {
    const days = period === 'week' ? 7 : period === 'month' ? dayjs(anchor).daysInMonth() : 365;
    const total = periodEntries.reduce((sum, entry) => sum + entry.calories, 0);
    return Math.round(total / days);
  }, [periodEntries, period, anchor]);

  const macros = useMemo(
    () =>
      periodEntries.reduce(
        (acc, entry) => ({
          protein: acc.protein + entry.protein,
          fat: acc.fat + entry.fat,
          carbs: acc.carbs + entry.carbs,
        }),
        { protein: 0, fat: 0, carbs: 0 },
      ),
    [periodEntries],
  );

  const shift = (direction: number) => {
    const unit = period === 'week' ? 'week' : period === 'month' ? 'month' : 'year';
    setAnchor((current) => dayjs(current).add(direction, unit).toDate());
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 space-y-5 px-4 pb-6 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Статистика</h1>
        <PeriodTabs value={period} onChange={setPeriod} />
        <PeriodNavigator label={rangeLabel} onPrev={() => shift(-1)} onNext={() => shift(1)} />
        <CaloriesChart data={points} />
        <AverageCard average={average} />
        <MacroDonut protein={macros.protein} fat={macros.fat} carbs={macros.carbs} />
      </main>

      <BottomNav active="stats" onNavigate={(id) => router.push(id === 'home' ? '/' : `/${id}`)} />
    </div>
  );
}
