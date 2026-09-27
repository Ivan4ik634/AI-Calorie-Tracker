import type { UserProfile } from '@/types';
import { readJson, writeJson } from './localStorage';

const PROFILE_KEY = 'calorie-counter:user-profile';

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  weight: 72,
  goalType: 'lose',
  onboarded: false,
};

export const profileStorage = {
  load(): UserProfile {
    const stored = readJson<Partial<UserProfile> | null>(PROFILE_KEY, null);
    if (!stored) return DEFAULT_PROFILE;

    // Migrate profiles saved before the onboarding flag existed.
    return {
      ...DEFAULT_PROFILE,
      ...stored,
      onboarded: stored.onboarded ?? true,
    };
  },
  save(profile: UserProfile): void {
    writeJson(PROFILE_KEY, profile);
  },
};
