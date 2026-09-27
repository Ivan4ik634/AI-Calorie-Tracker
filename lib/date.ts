import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);
dayjs.locale('uk');

export { dayjs };

export type DateInput = dayjs.ConfigType;

export const WEEKDAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

export function isSameDay(a: DateInput, b: DateInput) {
  return dayjs(a).isSame(dayjs(b), 'day');
}

export function toDayKey(value: DateInput) {
  return dayjs(value).format('YYYY-MM-DD');
}

/** Monday-based week containing the given date. */
export function getWeekDays(date: DateInput) {
  const start = dayjs(date).startOf('isoWeek');
  return Array.from({ length: 7 }, (_, index) => start.add(index, 'day'));
}

export function formatDayNumber(date: DateInput) {
  return dayjs(date).format('D');
}

/** Full month grid (Monday-first) including leading/trailing days. */
export function getMonthGrid(date: DateInput) {
  const start = dayjs(date).startOf('month').startOf('isoWeek');
  const end = dayjs(date).endOf('month').endOf('isoWeek');
  const totalDays = end.diff(start, 'day') + 1;

  return Array.from({ length: totalDays }, (_, index) => start.add(index, 'day'));
}

export function formatMonthLabel(date: DateInput) {
  return dayjs(date).format('MMMM YYYY');
}

export function formatFullDate(date: DateInput) {
  return dayjs(date).format('D MMMM YYYY');
}

export function isToday(date: DateInput) {
  return dayjs(date).isSame(dayjs(), 'day');
}

export function isSameMonth(a: DateInput, b: DateInput) {
  return dayjs(a).isSame(dayjs(b), 'month');
}

export function formatTime(iso: DateInput) {
  return dayjs(iso).format('HH:mm');
}

export function formatRangeLabel(start: DateInput, end: DateInput) {
  const from = dayjs(start);
  const to = dayjs(end);
  if (from.isSame(to, 'month')) {
    return `${from.format('D')} - ${to.format('D MMMM')}`;
  }
  return `${from.format('D MMM')} - ${to.format('D MMM')}`;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Сніданок',
  lunch: 'Обід',
  dinner: 'Вечеря',
  snack: 'Перекус',
};

export const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

/** Derives the meal type from the entry creation hour. */
export function getMealType(iso: string): MealType {
  const hour = dayjs(iso).hour();
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 22) return 'dinner';
  return 'snack';
}
