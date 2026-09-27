export type GoalType = 'lose' | 'maintain' | 'gain';

export type UnitSystem = 'metric' | 'imperial';

export interface UserProfile {
  name: string;
  weight: number;
  goalType: GoalType;
  onboarded: boolean;
}

export interface AppSettings {
  units: UnitSystem;
  darkTheme: boolean;
  notifications: boolean;
  mealReminders: boolean;
}
