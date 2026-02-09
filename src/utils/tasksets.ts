import { parseDateISO, getTodayISO } from './date';

/**
 * Get all days in a period (week or month) starting from startDate
 */
export function getDaysInPeriod(
  startDate: Date,
  periodType: 'week' | 'month'
): Date[] {
  const days: Date[] = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  if (periodType === 'week') {
    // Get 7 days starting from startDate
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
  } else {
    // Get all days in the month
    const year = start.getFullYear();
    const month = start.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push(day);
    }
  }

  return days;
}

/**
 * Get ISO date string (YYYY-MM-DD)
 */
export function getISODate(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if date is today
 */
export function isToday(date: string): boolean {
  return date === getTodayISO();
}

/**
 * Check if date is in the past
 */
export function isPast(date: string): boolean {
  const dateObj = parseDateISO(date);
  const todayObj = parseDateISO(getTodayISO());
  return dateObj < todayObj;
}

/**
 * Check if date is in the future
 */
export function isFuture(date: string): boolean {
  const dateObj = parseDateISO(date);
  const todayObj = parseDateISO(getTodayISO());
  return dateObj > todayObj;
}

/**
 * Get period end date
 */
export function getPeriodEndDate(
  startDate: Date,
  periodType: 'week' | 'month'
): Date {
  const end = new Date(startDate);
  
  if (periodType === 'week') {
    end.setDate(startDate.getDate() + 6);
  } else {
    end.setMonth(startDate.getMonth() + 1);
    end.setDate(0); // Last day of the month
  }
  
  return end;
}
