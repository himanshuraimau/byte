import { formatDateISO, parseDateISO, getTodayISO, getYesterdayISO, getTomorrowISO } from '@/utils/date';
import { TemporalMode } from '@/types/entities';

export class DateService {
  /**
   * Get date string for temporal mode
   */
  static getDateForMode(mode: TemporalMode): string {
    switch (mode) {
      case 'yesterday':
        return getYesterdayISO();
      case 'today':
        return getTodayISO();
      case 'tomorrow':
        return getTomorrowISO();
    }
  }

  /**
   * Get temporal mode for a given date
   */
  static getModeForDate(date: string): TemporalMode {
    const today = getTodayISO();
    const yesterday = getYesterdayISO();
    const tomorrow = getTomorrowISO();

    if (date === today) return 'today';
    if (date === yesterday) return 'yesterday';
    if (date === tomorrow) return 'tomorrow';
    
    // For dates in the past, return 'yesterday' mode (read-only)
    // For dates in the future, return 'tomorrow' mode (planning)
    const dateObj = parseDateISO(date);
    const todayObj = parseDateISO(today);
    
    if (dateObj < todayObj) {
      return 'yesterday';
    }
    
    return 'tomorrow';
  }

  /**
   * Format date for display
   */
  static formatDisplay(date: string): string {
    const dateObj = parseDateISO(date);
    const today = getTodayISO();
    const yesterday = getYesterdayISO();
    const tomorrow = getTomorrowISO();

    if (date === today) return 'TODAY';
    if (date === yesterday) return 'YESTERDAY';
    if (date === tomorrow) return 'TOMORROW';

    // Format as "JAN 20, 2026"
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  /**
   * Check if date is today
   */
  static isToday(date: string): boolean {
    return date === getTodayISO();
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: string): boolean {
    const dateObj = parseDateISO(date);
    const todayObj = parseDateISO(getTodayISO());
    return dateObj < todayObj;
  }

  /**
   * Check if date is in the future
   */
  static isFuture(date: string): boolean {
    const dateObj = parseDateISO(date);
    const todayObj = parseDateISO(getTodayISO());
    return dateObj > todayObj;
  }
}
