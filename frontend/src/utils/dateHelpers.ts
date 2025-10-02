/**
 * Date Helper Utilities
 *
 * Provides date parsing, formatting, sorting, and grouping functions
 * for handling screening dates and times.
 */

/**
 * Parse ISO 8601 datetime string
 * @param isoString ISO 8601 datetime string
 * @returns Date object or null if invalid
 */
export function parseISODate(isoString: string): Date | null {
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Format date for display
 * @param date Date string or Date object
 * @param locale Locale for formatting ('zh-HK' or 'en-US')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, locale: string = 'zh-HK'): string {
  const d = new Date(date);

  if (locale === 'zh-HK') {
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}月${day}日`;
  }

  return d.toLocaleDateString(locale, { month: 'long', day: 'numeric' });
}

/**
 * Format date with day of week
 * @param date Date string or Date object
 * @param locale Locale for formatting
 * @returns Formatted date with day of week
 */
export function formatDateWithDay(date: string | Date, locale: string = 'en-US'): string {
  const d = new Date(date);
  const dayName = d.toLocaleDateString(locale, { weekday: 'long' });
  const dateStr = d.toLocaleDateString(locale, { month: 'long', day: 'numeric' });
  return `${dateStr} (${dayName})`;
}

/**
 * Extract and format time as HH:MM
 * @param datetime ISO 8601 datetime string or Date object
 * @returns Time string in HH:MM format
 */
export function formatTime(datetime: string | Date): string {
  const date = new Date(datetime);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Sort screenings by datetime (ascending)
 * @param screenings Array of objects with datetime property
 * @returns New sorted array (original not mutated)
 */
export function sortByDatetime<T extends { datetime: string }>(screenings: T[]): T[] {
  return [...screenings].sort((a, b) => {
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });
}

/**
 * Check if two dates are the same day (ignoring time)
 * @param date1 First date
 * @param date2 Second date
 * @returns True if same day, false otherwise
 */
export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Group screenings by date
 * @param screenings Array of objects with datetime property
 * @returns Object with date strings as keys and arrays of screenings as values
 */
export function groupByDate<T extends { datetime: string }>(screenings: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};

  screenings.forEach(screening => {
    const date = screening.datetime.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(screening);
  });

  return groups;
}

/**
 * Extract date component from ISO datetime string
 * @param datetime ISO 8601 datetime string
 * @returns Date string in YYYY-MM-DD format
 */
export function extractDate(datetime: string): string {
  return datetime.split('T')[0];
}

/**
 * Get day of week name
 * @param date Date string or Date object
 * @param locale Locale for day name
 * @returns Day of week name
 */
export function getDayOfWeek(date: string | Date, locale: string = 'en-US'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale, { weekday: 'long' });
}
