'use client';

import { BottomNav } from '@/components/shared/BottomNav';
import { CalendarDialog } from '@/components/shared/CalendarDialog';
import { MealDetailDialog } from '@/components/shared/MealDetailDialog';
import { WeekCalendar } from '@/components/shared/WeekCalendar';
import { useFoodDiary } from '@/hooks/useFoodDiary';
import { isSameDay } from '@/lib/date';
import { useFoodDiaryStore } from '@/stores/foodDiaryStore';
import { useGoalsStore } from '@/stores/goalsStore';
import type { FoodEntry } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DailySummary } from './DailySummary';
import { DiaryHeader } from './DiaryHeader';
import { MealList } from './MealList';

export default function DiaryPage() {
  const router = useRouter();
  const { entries, goals, updateEntry, removeEntry } = useFoodDiary();
  const hydrateDiary = useFoodDiaryStore((state) => state.hydrate);
  const hydrateGoals = useGoalsStore((state) => state.hydrate);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [detailEntry, setDetailEntry] = useState<FoodEntry | null>(null);

  useEffect(() => {
    hydrateDiary();
    hydrateGoals();
  }, [hydrateDiary, hydrateGoals]);

  const dayEntries = useMemo(
    () => entries.filter((entry) => isSameDay(entry.createdAt, selectedDate)),
    [entries, selectedDate],
  );

  const consumed = useMemo(
    () =>
      dayEntries.filter((entry) => entry.eaten).reduce((total, entry) => total + entry.calories, 0),
    [dayEntries],
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 space-y-5 px-4 pb-6 pt-6">
        <DiaryHeader onOpenCalendar={() => setCalendarOpen(true)} />

        <WeekCalendar selected={selectedDate} onSelect={setSelectedDate} />
        <DailySummary consumed={consumed} goal={goals.calories} />
        <MealList entries={dayEntries} onSelect={setDetailEntry} />
      </main>

      <BottomNav active="diary" onNavigate={(id) => router.push(id === 'home' ? '/' : `/${id}`)} />

      <CalendarDialog
        open={calendarOpen}
        selected={selectedDate}
        onOpenChange={setCalendarOpen}
        onSelect={setSelectedDate}
      />

      <MealDetailDialog
        entry={detailEntry}
        onOpenChange={(open) => !open && setDetailEntry(null)}
        onSave={updateEntry}
        onDelete={removeEntry}
      />
    </div>
  );
}
