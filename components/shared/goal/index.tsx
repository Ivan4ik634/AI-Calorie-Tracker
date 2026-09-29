'use client';

import { BottomNav } from '@/components/shared/BottomNav';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GOAL_LABELS, GOAL_ORDER } from '@/lib/profile';
import { useGoalsStore } from '@/stores/goalsStore';
import { useProfileStore } from '@/stores/profileStore';
import type { GoalType } from '@/types';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CALORIE_STEP = 50;
const CALORIE_MIN = 1000;
const CALORIE_MAX = 5000;

export default function GoalPage() {
  const router = useRouter();
  const { profile, hydrate: hydrateProfile, updateProfile } = useProfileStore();
  const { goals, hydrate: hydrateGoals, setGoals } = useGoalsStore();
  const profileHydrated = useProfileStore((state) => state.hydrated);
  const goalsHydrated = useGoalsStore((state) => state.hydrated);

  useEffect(() => {
    hydrateProfile();
    hydrateGoals();
  }, [hydrateProfile, hydrateGoals]);

  const handleSave = (goalType: GoalType, calories: number) => {
    updateProfile({ goalType });
    setGoals({ calories });
    router.push('/profile');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 space-y-5 px-4 pb-6 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Ціль</h1>

        {profileHydrated && goalsHydrated && (
          <GoalForm
            key={`${profile.goalType}-${goals.calories}`}
            initialGoalType={profile.goalType}
            initialCalories={goals.calories}
            onSave={handleSave}
          />
        )}
      </main>

      <BottomNav
        active="profile"
        onNavigate={(id) => router.push(id === 'home' ? '/' : `/${id}`)}
      />
    </div>
  );
}

interface GoalFormProps {
  initialGoalType: GoalType;
  initialCalories: number;
  onSave: (goalType: GoalType, calories: number) => void;
}

function GoalForm({ initialGoalType, initialCalories, onSave }: GoalFormProps) {
  const [goalType, setGoalType] = useState<GoalType>(initialGoalType);
  const [calories, setCalories] = useState(initialCalories);

  const adjustCalories = (delta: number) => {
    setCalories((current) => Math.min(CALORIE_MAX, Math.max(CALORIE_MIN, current + delta)));
  };

  return (
    <>
      <RadioGroup
        value={goalType}
        onValueChange={(value) => setGoalType(value as GoalType)}
        className="gap-0 divide-y divide-border/50 rounded-2xl border border-border/60 bg-card px-4">
        {GOAL_ORDER.map((type) => (
          <label key={type} className="flex cursor-pointer items-center gap-3 py-3.5">
            <RadioGroupItem value={type} />
            <span className="text-sm font-medium">{GOAL_LABELS[type]}</span>
          </label>
        ))}
      </RadioGroup>

      <section className="space-y-3 rounded-2xl border border-border/60 bg-card p-4">
        <p className="text-xs text-muted-foreground">Калорійність</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">{calories} ккал</span>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Зменшити"
              onClick={() => adjustCalories(-CALORIE_STEP)}
              className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-muted/70">
              <Minus className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Збільшити"
              onClick={() => adjustCalories(CALORIE_STEP)}
              className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-muted/70">
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <Button
        type="button"
        onClick={() => onSave(goalType, calories)}
        className="h-12 w-full rounded-xl text-base">
        Зберегти
      </Button>
    </>
  );
}
