'use client';

import { BottomNav } from '@/components/shared/BottomNav';
import { CalendarDialog } from '@/components/shared/CalendarDialog';
import { MealDetailDialog } from '@/components/shared/MealDetailDialog';
import type { NutritionValues } from '@/components/shared/NutritionFields';
import { Dialog, DialogBackdrop, DialogPopup, DialogPortal } from '@/components/ui/dialog';
import { useFoodAnalysis } from '@/hooks/useFoodAnalysis';
import { useFoodDiary } from '@/hooks/useFoodDiary';
import { useImageInput } from '@/hooks/useImageInput';
import { isSameDay } from '@/lib/date';
import type { EditableNutrition } from '@/lib/nutrition';
import { editableToEntryPatch } from '@/lib/nutrition';
import { useFoodDiaryStore } from '@/stores/foodDiaryStore';
import { useGoalsStore } from '@/stores/goalsStore';
import { useProfileStore } from '@/stores/profileStore';
import type { FoodEntry } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AddFoodCard } from './AddFoodCard';
import { CalorieProgress } from './CalorieProgress';
import { FoodAnalysisError, FoodAnalysisResult, FoodNotDetected } from './FoodAnalysisResult';
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

  const handleConfirm = async (values: NutritionValues & { name: string }) => {
    const saved = await addEntry({
      name: values.name,
      calories: values.calories,
      protein: values.protein,
      fat: values.fat,
      carbs: values.carbs,
      grams: values.grams,
      caloriesPer100g: values.per100g?.calories,
      proteinPer100g: values.per100g?.protein,
      fatPer100g: values.per100g?.fat,
      carbsPer100g: values.per100g?.carbs,
      eaten: true,
      image: analysis.image ?? undefined,
    });
    if (!saved) {
      toast.error('Не вдалося зберегти запис. Спробуйте ще раз.');
    }
    closeFlow();
  };

  const handleSaveDetail = async (id: string, values: EditableNutrition & { eaten: boolean }) => {
    const saved = await updateEntry(id, { ...editableToEntryPatch(values), eaten: values.eaten });
    if (!saved) {
      toast.error('Не вдалося зберегти зміни. Спробуйте ще раз.');
    }
  };

  const showSource = analysis.status === 'idle' || analysis.status === 'selecting';

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

            {analysis.status === 'not-food' && (
              <FoodNotDetected
                message={analysis.error ?? 'На фото не схоже на їжу.'}
                onCamera={openCamera}
                onGallery={openGallery}
              />
            )}
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
