import { TemporalMode } from "@/types/entities";
import {
    getTodayISO,
    getTomorrowISO,
    getYesterdayISO,
    parseDateISO,
} from "@/utils/date";

export class DateService {
  /**
   * Get date string for temporal mode
   */
  static getDateForMode(mode: TemporalMode): string {
    switch (mode) {
      case "yesterday":
        return getYesterdayISO();
      case "today":
        return getTodayISO();
      case "tomorrow":
        return getTomorrowISO();
      case "custom":
        // For custom mode, return today as fallback
        // The actual date will be set via setSelectedDate
        return getTodayISO();
    }
  }

  /**
   * Get temporal mode for a given date
   */
  static getModeForDate(date: string): TemporalMode {
    const today = getTodayISO();
    const yesterday = getYesterdayISO();
    const tomorrow = getTomorrowISO();

    if (date === today) return "today";
    if (date === yesterday) return "yesterday";
    if (date === tomorrow) return "tomorrow";

    // For any other date, return 'custom' mode
    return "custom";
  }

  /**
   * Format date for display
   */
  static formatDisplay(date: string): string {
    const dateObj = parseDateISO(date);
    const today = getTodayISO();
    const yesterday = getYesterdayISO();
    const tomorrow = getTomorrowISO();

    if (date === today) return "TODAY";
    if (date === yesterday) return "YESTERDAY";
    if (date === tomorrow) return "TOMORROW";

    // Format as "JAN 20, 2026"
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
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

  /**
   * Format full date (e.g., "January 20, 2026")
   */
  static formatFullDate(date: string): string {
    const dateObj = parseDateISO(date);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  /**
   * Get day of week (e.g., "Monday")
   */
  static getDayOfWeek(date: string): string {
    const dateObj = parseDateISO(date);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dateObj.getDay()];
  }
}
