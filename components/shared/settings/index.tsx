'use client';

import { BottomNav } from '@/components/shared/BottomNav';
import { MenuRow } from '@/components/shared/profile/MenuRow';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { clearAllAppData } from '@/services/storage/appData';
import { useFoodDiaryStore } from '@/stores/foodDiaryStore';
import { useGoalsStore } from '@/stores/goalsStore';
import { useProfileStore } from '@/stores/profileStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Ruler, Shield, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UnitsDialog } from './UnitsDialog';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, hydrate, updateSettings } = useSettingsStore();
  const clearDiary = useFoodDiaryStore((state) => state.clear);
  const resetGoals = useGoalsStore((state) => state.reset);
  const resetProfile = useProfileStore((state) => state.reset);

  const [unitsOpen, setUnitsOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleClearData = async () => {
    await clearAllAppData();
    await clearDiary();
    resetGoals();
    resetProfile();
    setClearOpen(false);
    router.replace('/onboarding');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 space-y-5 px-4 pb-6 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Налаштування</h1>

        <div className="divide-y divide-border/50 rounded-2xl border border-border/60 bg-card px-4">
          <MenuRow icon={Ruler} label="Одиниці вимірювання" onClick={() => setUnitsOpen(true)} />

          <MenuRow
            icon={Trash}
            label="Очистити дані"
            onClick={() => setClearOpen(true)}
            destructive
          />
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

      <UnitsDialog
        open={unitsOpen}
        value={settings.units}
        onOpenChange={setUnitsOpen}
        onSave={(units) => updateSettings({ units })}
      />

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup>
            <DialogTitle>Очистити всі дані?</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Буде видалено всі записи щоденника, цілі, ім&apos;я, вагу та налаштування. Цю дію не
              можна скасувати.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setClearOpen(false)}
                className="h-11 flex-1 rounded-xl">
                Скасувати
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleClearData}
                className="h-11 flex-1 rounded-xl">
                Очистити
              </Button>
            </div>
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
