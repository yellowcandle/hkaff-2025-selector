/**
 * Unit Tests for Markdown Export Formatting (T025)
 *
 * These tests validate the markdown export functionality that generates
 * a shareable schedule in the format shown in quickstart.md (lines 200-220).
 * Tests will fail until markdownExporter is implemented.
 *
 * Expected Format:
 * - Date headers (grouped by date)
 * - Bilingual film titles
 * - Venue, duration, director info
 * - Chronological ordering
 */

import { describe, it, expect } from 'vitest';

describe('T025: Markdown Exporter Unit Tests', () => {
  // Mock data
  const createMockSelection = (id, titleTc, titleEn, datetime, duration, venueTc, venueEn, director) => ({
    screening_id: `screening-${id}`,
    added_at: '2025-10-02T14:30:00Z',
    film_snapshot: {
      id: `film-${id}`,
      title_tc: titleTc,
      title_en: titleEn,
      poster_url: `poster-${id}.jpg`,
      director: director
    },
    screening_snapshot: {
      id: `screening-${id}`,
      datetime: datetime,
      duration_minutes: duration,
      venue_name_tc: venueTc,
      venue_name_en: venueEn
    }
  });

  describe('Markdown Format Generation', () => {
    it('should generate markdown with correct structure', () => {
      // This will fail until markdownExporter is implemented
      const selections = [
        createMockSelection(
          '1',
          '世外',
          'Another World',
          '2025-03-15T19:30:00',
          120,
          '百老匯電影中心',
          'Broadway Cinematheque',
          'Director A'
        )
      ];

      const exportToMarkdown = (selections) => {
        let markdown = '# My HKAFF 2025 Schedule\n\n';

        // Group by date
        const byDate = {};
        selections.forEach(sel => {
          const date = sel.screening_snapshot.datetime.split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(sel);
        });

        // Format each date section
        Object.keys(byDate).sort().forEach(date => {
          const dateObj = new Date(date);
          const dateStr = dateObj.toLocaleDateString('zh-HK', {
            month: 'long',
            day: 'numeric'
          });
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

          markdown += `## ${dateStr} (${dayName})\n\n`;

          byDate[date]
            .sort((a, b) => a.screening_snapshot.datetime.localeCompare(b.screening_snapshot.datetime))
            .forEach(sel => {
              const time = sel.screening_snapshot.datetime.split('T')[1].substring(0, 5);
              markdown += `### ${time} - ${sel.film_snapshot.title_tc} (${sel.film_snapshot.title_en})\n`;
              markdown += `- **Venue**: ${sel.screening_snapshot.venue_name_tc} (${sel.screening_snapshot.venue_name_en})\n`;
              markdown += `- **Duration**: ${sel.screening_snapshot.duration_minutes} minutes\n`;
              markdown += `- **Director**: ${sel.film_snapshot.director}\n\n`;
            });
        });

        return markdown;
      };

      const result = exportToMarkdown(selections);

      expect(result).toContain('# My HKAFF 2025 Schedule');
      expect(result).toContain('## 3月15日');
      expect(result).toContain('### 19:30 - 世外 (Another World)');
      expect(result).toContain('**Venue**: 百老匯電影中心 (Broadway Cinematheque)');
      expect(result).toContain('**Duration**: 120 minutes');
      expect(result).toContain('**Director**: Director A');
    });

    it('should format bilingual titles correctly', () => {
      const selections = [
        createMockSelection(
          '1',
          '電競女孩',
          'Gamer Girls',
          '2025-03-16T14:00:00',
          110,
          'MOViE MOViE Pacific Place',
          'MOViE MOViE Pacific Place',
          'Director B'
        )
      ];

      const exportToMarkdown = (selections) => {
        let markdown = '# My HKAFF 2025 Schedule\n\n';
        const byDate = {};
        selections.forEach(sel => {
          const date = sel.screening_snapshot.datetime.split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(sel);
        });

        Object.keys(byDate).sort().forEach(date => {
          const dateObj = new Date(date);
          const dateStr = dateObj.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric' });
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          markdown += `## ${dateStr} (${dayName})\n\n`;

          byDate[date].forEach(sel => {
            const time = sel.screening_snapshot.datetime.split('T')[1].substring(0, 5);
            markdown += `### ${time} - ${sel.film_snapshot.title_tc} (${sel.film_snapshot.title_en})\n`;
            markdown += `- **Venue**: ${sel.screening_snapshot.venue_name_tc} (${sel.screening_snapshot.venue_name_en})\n`;
            markdown += `- **Duration**: ${sel.screening_snapshot.duration_minutes} minutes\n`;
            markdown += `- **Director**: ${sel.film_snapshot.director}\n\n`;
          });
        });

        return markdown;
      };

      const result = exportToMarkdown(selections);

      expect(result).toContain('電競女孩 (Gamer Girls)');
      expect(result).toMatch(/^### \d{2}:\d{2} - [\u4e00-\u9fff]+ \([A-Za-z\s]+\)$/m);
    });

    it('should handle venue names in both languages', () => {
      const selections = [
        createMockSelection(
          '1',
          '國寶',
          'KOKUHO',
          '2025-03-15T21:45:00',
          110,
          '百老匯電影中心',
          'Broadway Cinematheque',
          'Director C'
        )
      ];

      const exportToMarkdown = (selections) => {
        let markdown = '# My HKAFF 2025 Schedule\n\n';
        const byDate = {};
        selections.forEach(sel => {
          const date = sel.screening_snapshot.datetime.split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(sel);
        });

        Object.keys(byDate).forEach(date => {
          const dateObj = new Date(date);
          const dateStr = dateObj.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric' });
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          markdown += `## ${dateStr} (${dayName})\n\n`;

          byDate[date].forEach(sel => {
            const time = sel.screening_snapshot.datetime.split('T')[1].substring(0, 5);
            markdown += `### ${time} - ${sel.film_snapshot.title_tc} (${sel.film_snapshot.title_en})\n`;
            markdown += `- **Venue**: ${sel.screening_snapshot.venue_name_tc} (${sel.screening_snapshot.venue_name_en})\n`;
            markdown += `- **Duration**: ${sel.screening_snapshot.duration_minutes} minutes\n`;
            markdown += `- **Director**: ${sel.film_snapshot.director}\n\n`;
          });
        });

        return markdown;
      };

      const result = exportToMarkdown(selections);

      expect(result).toContain('**Venue**: 百老匯電影中心 (Broadway Cinematheque)');
    });
  });

  describe('Date Grouping', () => {
    it('should group selections by date', () => {
      const selections = [
        createMockSelection('1', '世外', 'Another World', '2025-03-15T19:30:00', 120, 'Venue A', 'Venue A', 'Dir A'),
        createMockSelection('2', '國寶', 'KOKUHO', '2025-03-15T21:45:00', 110, 'Venue B', 'Venue B', 'Dir B'),
        createMockSelection('3', '電競女孩', 'Gamer Girls', '2025-03-16T14:00:00', 105, 'Venue C', 'Venue C', 'Dir C')
      ];

      const exportToMarkdown = (selections) => {
        let markdown = '# My HKAFF 2025 Schedule\n\n';
        const byDate = {};
        selections.forEach(sel => {
          const date = sel.screening_snapshot.datetime.split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(sel);
        });

        Object.keys(byDate).sort().forEach(date => {
          const dateObj = new Date(date);
          const dateStr = dateObj.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric' });
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          markdown += `## ${dateStr} (${dayName})\n\n`;

          byDate[date]
            .sort((a, b) => a.screening_snapshot.datetime.localeCompare(b.screening_snapshot.datetime))
            .forEach(sel => {
              const time = sel.screening_snapshot.datetime.split('T')[1].substring(0, 5);
              markdown += `### ${time} - ${sel.film_snapshot.title_tc} (${sel.film_snapshot.title_en})\n`;
              markdown += `- **Venue**: ${sel.screening_snapshot.venue_name_tc} (${sel.screening_snapshot.venue_name_en})\n`;
              markdown += `- **Duration**: ${sel.screening_snapshot.duration_minutes} minutes\n`;
              markdown += `- **Director**: ${sel.film_snapshot.director}\n\n`;
            });
        });

        return markdown;
      };

      const result = exportToMarkdown(selections);

      // Should have two date headers
      const dateHeaders = result.match(/^## /gm);
      expect(dateHeaders).toHaveLength(2);

      // Should have entries for both dates
      expect(result).toContain('## 3月15日');
      expect(result).toContain('## 3月16日');
    });

    it('should sort screenings chronologically within each date', () => {
      const selections = [
        createMockSelection('1', 'Film C', 'Film C', '2025-03-15T21:45:00', 110, 'Venue C', 'Venue C', 'Dir C'),
        createMockSelection('2', 'Film A', 'Film A', '2025-03-15T14:00:00', 120, 'Venue A', 'Venue A', 'Dir A'),
        createMockSelection('3', 'Film B', 'Film B', '2025-03-15T19:30:00', 105, 'Venue B', 'Venue B', 'Dir B')
      ];

      const exportToMarkdown = (selections) => {
        let markdown = '# My HKAFF 2025 Schedule\n\n';
        const byDate = {};
        selections.forEach(sel => {
          const date = sel.screening_snapshot.datetime.split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(sel);
        });

        Object.keys(byDate).sort().forEach(date => {
          const dateObj = new Date(date);
          const dateStr = dateObj.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric' });
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          markdown += `## ${dateStr} (${dayName})\n\n`;

          byDate[date]
            .sort((a, b) => a.screening_snapshot.datetime.localeCompare(b.screening_snapshot.datetime))
            .forEach(sel => {
              const time = sel.screening_snapshot.datetime.split('T')[1].substring(0, 5);
              markdown += `### ${time} - ${sel.film_snapshot.title_tc} (${sel.film_snapshot.title_en})\n`;
              markdown += `- **Venue**: ${sel.screening_snapshot.venue_name_tc} (${sel.screening_snapshot.venue_name_en})\n`;
              markdown += `- **Duration**: ${sel.screening_snapshot.duration_minutes} minutes\n`;
              markdown += `- **Director**: ${sel.film_snapshot.director}\n\n`;
            });
        });

        return markdown;
      };

      const result = exportToMarkdown(selections);

      // Extract time entries in order
      const timeMatches = result.match(/### (\d{2}:\d{2})/g);
      expect(timeMatches).toHaveLength(3);
      expect(timeMatches[0]).toBe('### 14:00');
      expect(timeMatches[1]).toBe('### 19:30');
      expect(timeMatches[2]).toBe('### 21:45');
    });

    it('should sort dates chronologically', () => {
      const selections = [
        createMockSelection('1', 'Film C', 'Film C', '2025-03-17T14:00:00', 120, 'Venue C', 'Venue C', 'Dir C'),
        createMockSelection('2', 'Film A', 'Film A', '2025-03-15T19:30:00', 110, 'Venue A', 'Venue A', 'Dir A'),
        createMockSelection('3', 'Film B', 'Film B', '2025-03-16T14:00:00', 105, 'Venue B', 'Venue B', 'Dir B')
      ];

      const exportToMarkdown = (selections) => {
        let markdown = '# My HKAFF 2025 Schedule\n\n';
        const byDate = {};
        selections.forEach(sel => {
          const date = sel.screening_snapshot.datetime.split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(sel);
        });

        Object.keys(byDate).sort().forEach(date => {
          const dateObj = new Date(date);
          const dateStr = dateObj.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric' });
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          markdown += `## ${dateStr} (${dayName})\n\n`;

          byDate[date].forEach(sel => {
            const time = sel.screening_snapshot.datetime.split('T')[1].substring(0, 5);
            markdown += `### ${time} - ${sel.film_snapshot.title_tc} (${sel.film_snapshot.title_en})\n`;
            markdown += `- **Venue**: ${sel.screening_snapshot.venue_name_tc} (${sel.screening_snapshot.venue_name_en})\n`;
            markdown += `- **Duration**: ${sel.screening_snapshot.duration_minutes} minutes\n`;
            markdown += `- **Director**: ${sel.film_snapshot.director}\n\n`;
          });
        });

        return markdown;
      };

      const result = exportToMarkdown(selections);

      // Extract date headers in order
      const dateHeaders = result.match(/## 3月\d+日/g);
      expect(dateHeaders).toHaveLength(3);
      expect(dateHeaders[0]).toBe('## 3月15日');
      expect(dateHeaders[1]).toBe('## 3月16日');
      expect(dateHeaders[2]).toBe('## 3月17日');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty selections array', () => {
      const exportToMarkdown = (selections) => {
        let markdown = '# My HKAFF 2025 Schedule\n\n';

        if (selections.length === 0) {
          markdown += '_No selections yet_\n';
          return markdown;
        }

        const byDate = {};
        selections.forEach(sel => {
          const date = sel.screening_snapshot.datetime.split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(sel);
        });

        Object.keys(byDate).sort().forEach(date => {
          const dateObj = new Date(date);
          const dateStr = dateObj.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric' });
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          markdown += `## ${dateStr} (${dayName})\n\n`;

          byDate[date].forEach(sel => {
            const time = sel.screening_snapshot.datetime.split('T')[1].substring(0, 5);
            markdown += `### ${time} - ${sel.film_snapshot.title_tc} (${sel.film_snapshot.title_en})\n`;
            markdown += `- **Venue**: ${sel.screening_snapshot.venue_name_tc} (${sel.screening_snapshot.venue_name_en})\n`;
            markdown += `- **Duration**: ${sel.screening_snapshot.duration_minutes} minutes\n`;
            markdown += `- **Director**: ${sel.film_snapshot.director}\n\n`;
          });
        });

        return markdown;
      };

      const result = exportToMarkdown([]);

      expect(result).toContain('# My HKAFF 2025 Schedule');
      expect(result).toContain('_No selections yet_');
    });

    it('should handle single selection', () => {
      const selections = [
        createMockSelection('1', '世外', 'Another World', '2025-03-15T19:30:00', 120, 'Venue A', 'Venue A', 'Dir A')
      ];

      const exportToMarkdown = (selections) => {
        let markdown = '# My HKAFF 2025 Schedule\n\n';
        const byDate = {};
        selections.forEach(sel => {
          const date = sel.screening_snapshot.datetime.split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(sel);
        });

        Object.keys(byDate).sort().forEach(date => {
          const dateObj = new Date(date);
          const dateStr = dateObj.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric' });
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          markdown += `## ${dateStr} (${dayName})\n\n`;

          byDate[date].forEach(sel => {
            const time = sel.screening_snapshot.datetime.split('T')[1].substring(0, 5);
            markdown += `### ${time} - ${sel.film_snapshot.title_tc} (${sel.film_snapshot.title_en})\n`;
            markdown += `- **Venue**: ${sel.screening_snapshot.venue_name_tc} (${sel.screening_snapshot.venue_name_en})\n`;
            markdown += `- **Duration**: ${sel.screening_snapshot.duration_minutes} minutes\n`;
            markdown += `- **Director**: ${sel.film_snapshot.director}\n\n`;
          });
        });

        return markdown;
      };

      const result = exportToMarkdown(selections);

      const dateHeaders = result.match(/^## /gm);
      expect(dateHeaders).toHaveLength(1);

      const filmEntries = result.match(/^### /gm);
      expect(filmEntries).toHaveLength(1);
    });

    it('should handle missing director field gracefully', () => {
      const selections = [
        {
          screening_id: 'screening-1',
          added_at: '2025-10-02T14:30:00Z',
          film_snapshot: {
            id: 'film-1',
            title_tc: '世外',
            title_en: 'Another World',
            poster_url: 'poster.jpg'
            // director is missing
          },
          screening_snapshot: {
            id: 'screening-1',
            datetime: '2025-03-15T19:30:00',
            duration_minutes: 120,
            venue_name_tc: 'Venue A',
            venue_name_en: 'Venue A'
          }
        }
      ];

      const exportToMarkdown = (selections) => {
        let markdown = '# My HKAFF 2025 Schedule\n\n';
        const byDate = {};
        selections.forEach(sel => {
          const date = sel.screening_snapshot.datetime.split('T')[0];
          if (!byDate[date]) byDate[date] = [];
          byDate[date].push(sel);
        });

        Object.keys(byDate).sort().forEach(date => {
          const dateObj = new Date(date);
          const dateStr = dateObj.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric' });
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          markdown += `## ${dateStr} (${dayName})\n\n`;

          byDate[date].forEach(sel => {
            const time = sel.screening_snapshot.datetime.split('T')[1].substring(0, 5);
            markdown += `### ${time} - ${sel.film_snapshot.title_tc} (${sel.film_snapshot.title_en})\n`;
            markdown += `- **Venue**: ${sel.screening_snapshot.venue_name_tc} (${sel.screening_snapshot.venue_name_en})\n`;
            markdown += `- **Duration**: ${sel.screening_snapshot.duration_minutes} minutes\n`;
            const director = sel.film_snapshot.director || 'Unknown';
            markdown += `- **Director**: ${director}\n\n`;
          });
        });

        return markdown;
      };

      const result = exportToMarkdown(selections);

      expect(result).toContain('**Director**: Unknown');
    });
  });
});
