/**
 * MarkdownExporter Service - Exports user schedule to markdown format
 *
 * Implements IMarkdownExporter interface from service-interfaces.ts
 * Format matches quickstart.md lines 200-220
 */

import type {
  UserSelection,
  IMarkdownExporter
} from '../../../specs/001-given-this-film/contracts/service-interfaces';

/**
 * MarkdownExporter implementation
 */
class MarkdownExporter implements IMarkdownExporter {
  /**
   * Export user selections as markdown text
   * @param selections Array of user selections
   * @param language Language for output ('tc' or 'en')
   * @returns Markdown-formatted schedule string
   */
  exportSchedule(selections: UserSelection[], language: 'tc' | 'en'): string {
    let markdown = '# My HKAFF 2025 Schedule\n\n';

    if (selections.length === 0) {
      markdown += '_No selections yet_\n';
      return markdown;
    }

    // Group by date
    const grouped = this.groupByDate(selections);

    // Sort dates chronologically
    const sortedDates = Array.from(grouped.keys()).sort();

    // Format each date section
    sortedDates.forEach(dateKey => {
      const dateSelections = grouped.get(dateKey) || [];

      // Format date header
      const dateObj = new Date(dateKey);
      const dateStr = dateObj.toLocaleDateString('zh-HK', {
        month: 'long',
        day: 'numeric'
      });
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

      markdown += `## ${dateStr} (${dayName})\n\n`;

      // Sort selections by time within the day
      const sortedSelections = dateSelections.sort((a, b) =>
        a.screening_snapshot.datetime.localeCompare(b.screening_snapshot.datetime)
      );

      // Format each selection
      sortedSelections.forEach(selection => {
        markdown += this.formatSelection(selection, language);
      });
    });

    return markdown;
  }

  /**
   * Group selections by date for export
   * @param selections Array of user selections
   * @returns Map of date string to selections
   */
  groupByDate(selections: UserSelection[]): Map<string, UserSelection[]> {
    const groups = new Map<string, UserSelection[]>();

    selections.forEach(selection => {
      const date = selection.screening_snapshot.datetime.split('T')[0];

      if (!groups.has(date)) {
        groups.set(date, []);
      }

      groups.get(date)!.push(selection);
    });

    return groups;
  }

  /**
   * Format a single selection as markdown
   * @param selection The selection to format
   * @param language Language for output
   */
  formatSelection(selection: UserSelection, _language: 'tc' | 'en'): string {
    const { film_snapshot, screening_snapshot } = selection;

    // Extract time (HH:MM)
    const time = screening_snapshot.datetime.split('T')[1].substring(0, 5);

    // Get title and venue based on language
    const titleBilingual = `${film_snapshot.title_tc} (${film_snapshot.title_en})`;
    const venueBilingual = `${screening_snapshot.venue_name_tc} (${screening_snapshot.venue_name_en})`;

    // Get director (handle missing director)
    const director = (film_snapshot as any).director || 'Unknown';

    let markdown = `### ${time} - ${titleBilingual}\n`;
    markdown += `- **Venue**: ${venueBilingual}\n`;
    markdown += `- **Duration**: ${screening_snapshot.duration_minutes} minutes\n`;
    markdown += `- **Director**: ${director}\n\n`;

    return markdown;
  }
}

// Export both class and singleton instance
export { MarkdownExporter };
export const markdownExporter = new MarkdownExporter();
export default markdownExporter;
