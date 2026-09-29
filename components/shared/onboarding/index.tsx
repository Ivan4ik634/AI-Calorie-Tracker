'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUnits } from '@/hooks/useUnits';
import { GOAL_LABELS, GOAL_ORDER } from '@/lib/profile';
import { useGoalsStore } from '@/stores/goalsStore';
import { useProfileStore } from '@/stores/profileStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { GoalType } from '@/types';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const CALORIE_STEP = 50;
const CALORIE_MIN = 1000;
const CALORIE_MAX = 5000;

const STEPS = ['name', 'weight', 'goal', 'calories'] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, hydrate: hydrateProfile, updateProfile } = useProfileStore();
  const profileHydrated = useProfileStore((state) => state.hydrated);
  const { goals, setGoals } = useGoalsStore();
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const settingsHydrated = useSettingsStore((state) => state.hydrated);
  const { units, weightUnit, toDisplayWeight, fromDisplayWeight } = useUnits();

  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(String(profile.weight));
  const [goalType, setGoalType] = useState<GoalType>(profile.goalType);
  const [calories, setCalories] = useState(goals.calories);
  const weightInitialized = useRef(false);

  useEffect(() => {
    hydrateProfile();
    hydrateSettings();
  }, [hydrateProfile, hydrateSettings]);

  // Once stored profile + units are loaded, show the weight in the chosen unit.
  useEffect(() => {
    if (!profileHydrated || !settingsHydrated || weightInitialized.current) return;
    weightInitialized.current = true;
    setWeight(String(toDisplayWeight(profile.weight)));
  }, [profileHydrated, settingsHydrated, profile.weight, toDisplayWeight]);

  const step: Step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const canContinue =
    step === 'name' ? name.trim().length > 0 : step === 'weight' ? Number(weight) > 0 : true;

  const goNext = () => {
    if (!canContinue) return;
    if (isLast) {
      updateProfile({
        name: name.trim(),
        weight: fromDisplayWeight(Number(weight)),
        goalType,
        onboarded: true,
      });
      setGoals({ calories });
      router.replace('/');
      return;
    }
    setStepIndex((index) => index + 1);
  };

  const goBack = () => {
    if (isFirst) return;
    setStepIndex((index) => index - 1);
  };

  const adjustCalories = (delta: number) => {
    setCalories((current) => Math.min(CALORIE_MAX, Math.max(CALORIE_MIN, current + delta)));
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-6">
        <header className="flex items-center gap-2">
          {!isFirst && (
            <button
              type="button"
              aria-label="Назад"
              onClick={goBack}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
              <ChevronLeft className="size-5" />
            </button>
          )}
          <div className="flex flex-1 gap-1.5">
            {STEPS.map((item, index) => (
              <span
                key={item}
                className={`h-1.5 flex-1 rounded-full ${
                  index <= stepIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </header>

        <div className="flex-1 space-y-5">
          {step === 'name' && (
            <section className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Як вас звати?</h1>
                <p className="text-sm text-muted-foreground">
                  Це ім&apos;я буде відображатися на головній сторінці.
                </p>
              </div>
              <Input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && goNext()}
                placeholder="Ваше ім'я"
                className="h-12 rounded-xl text-base"
              />
            </section>
          )}

          {step === 'weight' && (
            <section className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Ваша вага</h1>
                <p className="text-sm text-muted-foreground">
                  Вкажіть поточну вагу у {units === 'imperial' ? 'фунтах' : 'кілограмах'}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  type="number"
                  autoComplete="off"
                  name="onboarding-weight"
                  inputMode="numeric"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && goNext()}
                  placeholder="72"
                  className="h-12 rounded-xl text-base"
                />
                <span className="text-sm text-muted-foreground">{weightUnit}</span>
              </div>
            </section>
          )}

          {step === 'goal' && (
            <section className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Ваша ціль</h1>
                <p className="text-sm text-muted-foreground">Оберіть, чого ви хочете досягти.</p>
              </div>
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
            </section>
          )}

          {step === 'calories' && (
            <section className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Денна норма</h1>
                <p className="text-sm text-muted-foreground">
                  Скільки калорій ви плануєте споживати щодня?
                </p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4">
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
          )}
        </div>

        <Button
          type="button"
          onClick={goNext}
          disabled={!canContinue}
          className="h-12 w-full rounded-xl text-base">
          {isLast ? 'Почати' : 'Далі'}
        </Button>
      </main>
    </div>
  );
}
