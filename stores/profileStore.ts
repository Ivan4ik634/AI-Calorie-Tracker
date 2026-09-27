import { DEFAULT_PROFILE, profileStorage } from '@/services/storage/profileStorage';
import type { UserProfile } from '@/types';
import { create } from 'zustand';

interface ProfileState {
  profile: UserProfile;
  hydrated: boolean;
  hydrate: () => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    set({ profile: profileStorage.load(), hydrated: true });
  },

  updateProfile: (partial) => {
    const profile = { ...get().profile, ...partial };
    profileStorage.save(profile);
    set({ profile });
  },

  reset: () => {
    profileStorage.save(DEFAULT_PROFILE);
    set({ profile: DEFAULT_PROFILE });
  },
}));
