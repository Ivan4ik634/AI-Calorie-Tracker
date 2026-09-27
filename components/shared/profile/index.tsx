'use client';

import { BottomNav } from '@/components/shared/BottomNav';
import { useUnits } from '@/hooks/useUnits';
import { useFoodDiaryStore } from '@/stores/foodDiaryStore';
import { useGoalsStore } from '@/stores/goalsStore';
import { useProfileStore } from '@/stores/profileStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Shield, Target, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EditFieldDialog } from './EditFieldDialog';
import { MenuRow } from './MenuRow';
import { ProfileHeader } from './ProfileHeader';

type EditTarget = 'name' | 'weight' | 'calories' | null;

export default function ProfilePage() {
  const router = useRouter();
  const { profile, hydrate: hydrateProfile, updateProfile } = useProfileStore();
  const { goals, hydrate: hydrateGoals, setGoals } = useGoalsStore();
  const hydrateDiary = useFoodDiaryStore((state) => state.hydrate);
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const { weightUnit, toDisplayWeight, fromDisplayWeight } = useUnits();

  const [editTarget, setEditTarget] = useState<EditTarget>(null);

  useEffect(() => {
    hydrateProfile();
    hydrateGoals();
    hydrateDiary();
    hydrateSettings();
  }, [hydrateProfile, hydrateGoals, hydrateDiary, hydrateSettings]);

  const displayWeight = toDisplayWeight(profile.weight);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 space-y-5 px-4 pb-6 pt-6">
        <ProfileHeader
          name={profile.name}
          goalType={profile.goalType}
          onEditName={() => setEditTarget('name')}
          onOpenSettings={() => router.push('/settings')}
        />

        <button
          type="button"
          onClick={() => setEditTarget('weight')}
          className="flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 text-left transition-colors hover:bg-muted/40">
          <span>
            <span className="block text-xs text-muted-foreground">Поточна вага</span>
            <span className="block text-xl font-bold">
              {displayWeight} {weightUnit}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setEditTarget('calories')}
          className="flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 text-left transition-colors hover:bg-muted/40">
          <span>
            <span className="block text-xs text-muted-foreground">Ціль</span>
            <span className="block text-xl font-bold">{goals.calories} ккал / день</span>
          </span>
        </button>

        <div className="divide-y divide-border/50 rounded-2xl border border-border/60 bg-card px-4">
          <MenuRow icon={Target} label="Налаштування цілі" onClick={() => router.push('/goal')} />
          <MenuRow icon={User} label="Налаштування профілю" onClick={() => setEditTarget('name')} />
          <MenuRow
            icon={Shield}
            label="Політика конфіденційності"
            onClick={() => router.push('/privacy')}
          />
        </div>
      </main>

      <BottomNav
        active="profile"
        onNavigate={(id) => router.push(id === 'home' ? '/' : `/${id}`)}
      />

      <EditFieldDialog
        open={editTarget === 'name'}
        title="Ім'я"
        label="Ваше ім'я"
        value={profile.name}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSave={(value) => updateProfile({ name: value })}
      />

      <EditFieldDialog
        open={editTarget === 'weight'}
        title="Поточна вага"
        label="Вага"
        value={displayWeight}
        type="number"
        suffix={weightUnit}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSave={(value) => updateProfile({ weight: fromDisplayWeight(Number(value)) })}
      />

      <EditFieldDialog
        open={editTarget === 'calories'}
        title="Ціль"
        label="Денна норма калорій"
        value={goals.calories}
        type="number"
        suffix="ккал"
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSave={(value) => setGoals({ calories: Number(value) })}
      />
    </div>
  );
}
