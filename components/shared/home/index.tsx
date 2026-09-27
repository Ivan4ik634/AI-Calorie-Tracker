'use client';

import { BottomNav } from '@/components/shared/BottomNav';
import { CalendarDialog } from '@/components/shared/CalendarDialog';
import { MealDetailDialog } from '@/components/shared/MealDetailDialog';
import { Dialog, DialogBackdrop, DialogPopup, DialogPortal } from '@/components/ui/dialog';
import { useFoodAnalysis } from '@/hooks/useFoodAnalysis';
import { useFoodDiary } from '@/hooks/useFoodDiary';
import { useImageInput } from '@/hooks/useImageInput';
import { isSameDay, isToday } from '@/lib/date';
import { useFoodDiaryStore } from '@/stores/foodDiaryStore';
import { useGoalsStore } from '@/stores/goalsStore';
import { useProfileStore } from '@/stores/profileStore';
import type { FoodAnalysis, FoodEntry } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AddFoodCard } from './AddFoodCard';
import { CalorieProgress } from './CalorieProgress';
import { FoodAnalysisError, FoodAnalysisResult } from './FoodAnalysisResult';
import { FoodPreview } from './FoodPreview';
import { FoodSourceModal } from './FoodSourceModal';
import { HomeHeader } from './HomeHeader';
import { MacroCards } from './MacroCards';
import { RecentMeals } from './RecentMeals';

export default function HomePage() {
  const router = useRouter();
  const { entries, goals, addEntry, updateEntry, removeEntry } = useFoodDiary();
  const hydrateDiary = useFoodDiaryStore((state) => state.hydrate);
  const hydrateGoals = useGoalsStore((state) => state.hydrate);
  const hydrateProfile = useProfileStore((state) => state.hydrate);
  const name = useProfileStore((state) => state.profile.name);

  const [isOpen, setIsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [detailEntry, setDetailEntry] = useState<FoodEntry | null>(null);
  const analysis = useFoodAnalysis();

  const { cameraInputRef, galleryInputRef, openCamera, openGallery, handleChange } = useImageInput(
    analysis.selectImage,
  );

  useEffect(() => {
    hydrateDiary();
    hydrateGoals();
    hydrateProfile();
  }, [hydrateDiary, hydrateGoals, hydrateProfile]);

  const dayEntries = useMemo(
    () => entries.filter((entry) => isSameDay(entry.createdAt, selectedDate)),
    [entries, selectedDate],
  );

  const totals = useMemo(
    () =>
      dayEntries
        .filter((entry) => entry.eaten)
        .reduce(
          (acc, entry) => ({
            calories: acc.calories + entry.calories,
            protein: acc.protein + entry.protein,
            fat: acc.fat + entry.fat,
            carbs: acc.carbs + entry.carbs,
          }),
          { calories: 0, protein: 0, fat: 0, carbs: 0 },
        ),
    [dayEntries],
  );

  const openFlow = () => {
    analysis.reset();
    setIsOpen(true);
  };

  const closeFlow = () => {
    setIsOpen(false);
    analysis.reset();
  };

  const handleConfirm = (values: FoodAnalysis) => {
    addEntry({
      name: values.name,
      calories: values.calories,
      protein: values.protein,
      fat: values.fat,
      carbs: values.carbs,
      grams: values.grams,
      eaten: true,
      image: analysis.image ?? undefined,
    });
    closeFlow();
  };

  const handleSaveDetail = (
    id: string,
    values: {
      calories: number;
      protein: number;
      fat: number;
      carbs: number;
      grams?: number;
      eaten: boolean;
    },
  ) => {
    updateEntry(id, values);
  };

  const showSource = analysis.status === 'idle' || analysis.status === 'selecting';
  const viewingToday = isToday(selectedDate);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 space-y-6 px-4 pb-6 pt-6">
        <HomeHeader name={name} onOpenCalendar={() => setCalendarOpen(true)} />

        <CalorieProgress consumed={totals.calories} goal={goals.calories} />
        <MacroCards protein={totals.protein} fat={totals.fat} carbs={totals.carbs} goals={goals} />
        <AddFoodCard onClick={openFlow} />
        <RecentMeals entries={dayEntries} onSelect={setDetailEntry} />
      </main>

      <BottomNav active="home" onNavigate={(id) => router.push(id === 'home' ? '/' : `/${id}`)} />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <CalendarDialog
        open={calendarOpen}
        selected={selectedDate}
        onOpenChange={setCalendarOpen}
        onSelect={setSelectedDate}
      />

      <MealDetailDialog
        entry={detailEntry}
        onOpenChange={(open) => !open && setDetailEntry(null)}
        onSave={handleSaveDetail}
        onDelete={removeEntry}
      />

      <Dialog open={isOpen} onOpenChange={(open) => !open && closeFlow()}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup>
            {showSource && <FoodSourceModal onCamera={openCamera} onGallery={openGallery} />}

            {analysis.status === 'preview' && analysis.image && (
              <FoodPreview image={analysis.image} />
            )}

            {analysis.status === 'analyzing' && analysis.image && (
              <FoodPreview image={analysis.image} isLoading />
            )}

            {analysis.status === 'success' && analysis.image && analysis.result && (
              <FoodAnalysisResult
                image={analysis.image}
                result={analysis.result}
                onConfirm={handleConfirm}
                onRetry={analysis.retry}
              />
            )}

            {analysis.status === 'error' && (
              <FoodAnalysisError
                message={analysis.error ?? 'Спробуйте ще раз.'}
                onRetry={analysis.retry}
              />
            )}
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
