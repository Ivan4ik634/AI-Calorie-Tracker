import { DEFAULT_SETTINGS, settingsStorage } from '@/services/storage/settingsStorage';
import type { AppSettings } from '@/types';
import { create } from 'zustand';

interface SettingsState {
  settings: AppSettings;
  hydrated: boolean;
  hydrate: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    set({ settings: settingsStorage.load(), hydrated: true });
  },

  updateSettings: (partial) => {
    const settings = { ...get().settings, ...partial };
    settingsStorage.save(settings);
    set({ settings });
  },
}));
