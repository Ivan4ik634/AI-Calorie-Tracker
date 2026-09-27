import type { GoalType } from '@/types';

export const GOAL_LABELS: Record<GoalType, string> = {
  lose: 'Схуднення',
  maintain: 'Підтримка ваги',
  gain: 'Набір маси',
};

export const GOAL_ORDER: GoalType[] = ['lose', 'maintain', 'gain'];
