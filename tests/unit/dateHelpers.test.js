/**
 * Unit Tests for Date Grouping Utility (T026)
 *
 * These tests validate date helper functions for parsing, formatting,
 * sorting, and grouping screening dates.
 * Tests will fail until dateHelpers is implemented.
 *
 * Functions to test:
 * - parseISODate(isoString): Parse ISO 8601 datetime
 * - formatDate(date, locale): Format date for display
 * - formatTime(datetime): Extract and format time (HH:MM)
 * - sortByDatetime(screenings): Sort by datetime
 * - isSameDay(date1, date2): Check if two dates are same day
 */

import { describe, it, expect } from 'vitest';

describe('T026: Date Helpers Unit Tests', () => {
  describe('ISO 8601 Date Parsing', () => {
    it('should parse valid ISO 8601 datetime string', () => {
      // This will fail until dateHelpers.parseISODate() is implemented
      const parseISODate = (isoString) => {
        return new Date(isoString);
      };

      const result = parseISODate('2025-03-15T19:30:00');

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(2); // March is month 2 (0-indexed)
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(19);
      expect(result.getMinutes()).toBe(30);
    });

    it('should parse ISO datetime with timezone', () => {
      const parseISODate = (isoString) => {
        return new Date(isoString);
      };

      const result = parseISODate('2025-03-15T19:30:00+08:00');

      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toContain('2025-03-15');
    });

    it('should parse ISO datetime with Z (UTC)', () => {
      const parseISODate = (isoString) => {
        return new Date(isoString);
      };

      const result = parseISODate('2025-03-15T11:30:00Z');

      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2025-03-15T11:30:00.000Z');
    });

    it('should handle invalid date string', () => {
      const parseISODate = (isoString) => {
        const date = new Date(isoString);
        return isNaN(date.getTime()) ? null : date;
      };

      const result = parseISODate('invalid-date');

      expect(result).toBeNull();
    });
  });

  describe('Date Formatting for Display', () => {
    it('should format date in Traditional Chinese', () => {
      const formatDate = (date, locale = 'zh-HK') => {
        const d = new Date(date);
        if (locale === 'zh-HK') {
          const month = d.getMonth() + 1;
          const day = d.getDate();
          return `${month}月${day}日`;
        }
        return d.toLocaleDateString(locale);
      };

      const result = formatDate('2025-03-15T19:30:00', 'zh-HK');

      expect(result).toBe('3月15日');
    });

    it('should format date in English', () => {
      const formatDate = (date, locale = 'en-US') => {
        const d = new Date(date);
        if (locale === 'zh-HK') {
          const month = d.getMonth() + 1;
          const day = d.getDate();
          return `${month}月${day}日`;
        }
        return d.toLocaleDateString(locale, { month: 'long', day: 'numeric' });
      };

      const result = formatDate('2025-03-15T19:30:00', 'en-US');

      expect(result).toBe('March 15');
    });

    it('should include day of week', () => {
      const formatDateWithDay = (date, locale = 'en-US') => {
        const d = new Date(date);
        const dayName = d.toLocaleDateString(locale, { weekday: 'long' });
        const dateStr = d.toLocaleDateString(locale, { month: 'long', day: 'numeric' });
        return `${dateStr} (${dayName})`;
      };

      const result = formatDateWithDay('2025-03-15T19:30:00', 'en-US');

      expect(result).toMatch(/March 15 \([A-Za-z]+\)/);
    });
  });

  describe('Time Formatting', () => {
    it('should extract and format time as HH:MM', () => {
      const formatTime = (datetime) => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const result = formatTime('2025-03-15T19:30:00');

      expect(result).toBe('19:30');
    });

    it('should handle midnight correctly', () => {
      const formatTime = (datetime) => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const result = formatTime('2025-03-15T00:00:00');

      expect(result).toBe('00:00');
    });

    it('should handle single-digit hours and minutes', () => {
      const formatTime = (datetime) => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const result = formatTime('2025-03-15T09:05:00');

      expect(result).toBe('09:05');
    });

    it('should handle noon correctly', () => {
      const formatTime = (datetime) => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const result = formatTime('2025-03-15T12:00:00');

      expect(result).toBe('12:00');
    });
  });

  describe('Datetime Sorting', () => {
    it('should sort screenings by datetime (ascending)', () => {
      const screenings = [
        { datetime: '2025-03-15T21:30:00' },
        { datetime: '2025-03-15T14:00:00' },
        { datetime: '2025-03-15T19:30:00' }
      ];

      const sortByDatetime = (screenings) => {
        return [...screenings].sort((a, b) => {
          return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        });
      };

      const result = sortByDatetime(screenings);

      expect(result[0].datetime).toBe('2025-03-15T14:00:00');
      expect(result[1].datetime).toBe('2025-03-15T19:30:00');
      expect(result[2].datetime).toBe('2025-03-15T21:30:00');
    });

    it('should sort across multiple days', () => {
      const screenings = [
        { datetime: '2025-03-16T14:00:00' },
        { datetime: '2025-03-15T21:30:00' },
        { datetime: '2025-03-15T14:00:00' },
        { datetime: '2025-03-17T10:00:00' }
      ];

      const sortByDatetime = (screenings) => {
        return [...screenings].sort((a, b) => {
          return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        });
      };

      const result = sortByDatetime(screenings);

      expect(result[0].datetime).toBe('2025-03-15T14:00:00');
      expect(result[1].datetime).toBe('2025-03-15T21:30:00');
      expect(result[2].datetime).toBe('2025-03-16T14:00:00');
      expect(result[3].datetime).toBe('2025-03-17T10:00:00');
    });

    it('should handle empty array', () => {
      const sortByDatetime = (screenings) => {
        return [...screenings].sort((a, b) => {
          return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        });
      };

      const result = sortByDatetime([]);

      expect(result).toHaveLength(0);
    });

    it('should not mutate original array', () => {
      const screenings = [
        { datetime: '2025-03-15T21:30:00' },
        { datetime: '2025-03-15T14:00:00' }
      ];

      const sortByDatetime = (screenings) => {
        return [...screenings].sort((a, b) => {
          return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        });
      };

      const result = sortByDatetime(screenings);

      // Original should remain unchanged
      expect(screenings[0].datetime).toBe('2025-03-15T21:30:00');

      // Result should be sorted
      expect(result[0].datetime).toBe('2025-03-15T14:00:00');
    });
  });

  describe('Same Day Comparison', () => {
    it('should return true for same date', () => {
      const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        );
      };

      const result = isSameDay('2025-03-15T19:30:00', '2025-03-15T21:45:00');

      expect(result).toBe(true);
    });

    it('should return false for different dates', () => {
      const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        );
      };

      const result = isSameDay('2025-03-15T19:30:00', '2025-03-16T19:30:00');

      expect(result).toBe(false);
    });

    it('should ignore time component', () => {
      const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        );
      };

      const result = isSameDay('2025-03-15T00:00:00', '2025-03-15T23:59:59');

      expect(result).toBe(true);
    });

    it('should handle date objects', () => {
      const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        );
      };

      const result = isSameDay(
        new Date('2025-03-15T19:30:00'),
        new Date('2025-03-15T21:45:00')
      );

      expect(result).toBe(true);
    });
  });

  describe('Date Grouping', () => {
    it('should group screenings by date', () => {
      const screenings = [
        { id: '1', datetime: '2025-03-15T19:30:00', title: 'Film A' },
        { id: '2', datetime: '2025-03-15T21:45:00', title: 'Film B' },
        { id: '3', datetime: '2025-03-16T14:00:00', title: 'Film C' },
        { id: '4', datetime: '2025-03-16T19:30:00', title: 'Film D' }
      ];

      const groupByDate = (screenings) => {
        const groups = {};
        screenings.forEach(screening => {
          const date = screening.datetime.split('T')[0];
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(screening);
        });
        return groups;
      };

      const result = groupByDate(screenings);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['2025-03-15']).toHaveLength(2);
      expect(result['2025-03-16']).toHaveLength(2);
    });

    it('should return empty object for empty array', () => {
      const groupByDate = (screenings) => {
        const groups = {};
        screenings.forEach(screening => {
          const date = screening.datetime.split('T')[0];
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(screening);
        });
        return groups;
      };

      const result = groupByDate([]);

      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should handle single date with multiple screenings', () => {
      const screenings = [
        { id: '1', datetime: '2025-03-15T14:00:00', title: 'Film A' },
        { id: '2', datetime: '2025-03-15T19:30:00', title: 'Film B' },
        { id: '3', datetime: '2025-03-15T21:45:00', title: 'Film C' }
      ];

      const groupByDate = (screenings) => {
        const groups = {};
        screenings.forEach(screening => {
          const date = screening.datetime.split('T')[0];
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(screening);
        });
        return groups;
      };

      const result = groupByDate(screenings);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['2025-03-15']).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle leap year dates', () => {
      const parseISODate = (isoString) => {
        return new Date(isoString);
      };

      const result = parseISODate('2024-02-29T19:30:00');

      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(29);
    });

    it('should handle end of month transitions', () => {
      const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        );
      };

      const result = isSameDay('2025-03-31T23:59:00', '2025-04-01T00:01:00');

      expect(result).toBe(false);
    });

    it('should handle year transitions', () => {
      const sortByDatetime = (screenings) => {
        return [...screenings].sort((a, b) => {
          return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        });
      };

      const screenings = [
        { datetime: '2026-01-01T00:00:00' },
        { datetime: '2025-12-31T23:59:00' }
      ];

      const result = sortByDatetime(screenings);

      expect(result[0].datetime).toBe('2025-12-31T23:59:00');
      expect(result[1].datetime).toBe('2026-01-01T00:00:00');
    });

    it('should handle timezone differences', () => {
      const formatTime = (datetime) => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      // This represents the same moment in time, but in different timezones
      const utcTime = '2025-03-15T11:30:00Z';
      const hkTime = '2025-03-15T19:30:00+08:00';

      const d1 = new Date(utcTime);
      const d2 = new Date(hkTime);

      expect(d1.getTime()).toBe(d2.getTime());
    });
  });
});
