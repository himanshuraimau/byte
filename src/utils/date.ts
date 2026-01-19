/**
 * Date utility functions
 */

/**
 * Format date to ISO 8601 (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse ISO 8601 date string to Date object
 */
export function parseDateISO(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Get today's date as ISO string
 */
export function getTodayISO(): string {
  return formatDateISO(new Date());
}

/**
 * Get yesterday's date as ISO string
 */
export function getYesterdayISO(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateISO(yesterday);
}

/**
 * Get tomorrow's date as ISO string
 */
export function getTomorrowISO(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateISO(tomorrow);
}

/**
 * Format timestamp to readable time (h:mm A)
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format duration in minutes to MM:SS
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}:${String(mins).padStart(2, '0')}`;
  }
  return `${mins}`;
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDurationSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
