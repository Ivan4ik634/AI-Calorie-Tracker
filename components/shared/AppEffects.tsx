'use client';

import { useMealReminders } from '@/hooks/useMealReminders';
import { useProfileStore } from '@/stores/profileStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Hydrates global state, runs app-wide side effects and guards onboarding. */
export function AppEffects() {
  const router = useRouter();
  const pathname = usePathname();
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const hydrateProfile = useProfileStore((state) => state.hydrate);
  const profileHydrated = useProfileStore((state) => state.hydrated);
  const onboarded = useProfileStore((state) => state.profile.onboarded);

  useEffect(() => {
    hydrateSettings();
    hydrateProfile();
  }, [hydrateSettings, hydrateProfile]);

  useEffect(() => {
    if (!profileHydrated) return;
    if (pathname === '/onboarding') return;
    if (!onboarded) router.replace('/onboarding');
  }, [profileHydrated, onboarded, pathname, router]);

  useMealReminders();

  return null;
}
