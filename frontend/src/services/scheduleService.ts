/**
 * ScheduleService - Manages user's personalized schedule
 *
 * Implements IScheduleService interface from service-interfaces.ts
 * Coordinates with storageService and conflictDetector
 */

import type {
  UserSelection,
  Conflict,
  IScheduleService
} from '../../../specs/001-given-this-film/contracts/service-interfaces';

import { storageService } from './storageService';
import { conflictDetector } from './conflictDetector';

/**
 * ScheduleService implementation
 */
class ScheduleService implements IScheduleService {
  /**
   * Get user's schedule grouped by date and sorted by time
   * @returns Map of date string to sorted selections
   */
  getGroupedSchedule(): Map<string, UserSelection[]> {
    const selections = storageService.getSelections();
    const grouped = new Map<string, UserSelection[]>();

    selections.forEach(selection => {
      const date = selection.screening_snapshot.datetime.split('T')[0];

      if (!grouped.has(date)) {
        grouped.set(date, []);
      }

      grouped.get(date)!.push(selection);
    });

    // Sort selections within each date group by datetime
    grouped.forEach((dateSelections, date) => {
      dateSelections.sort((a, b) =>
        a.screening_snapshot.datetime.localeCompare(b.screening_snapshot.datetime)
      );
      grouped.set(date, dateSelections);
    });

    return grouped;
  }

  /**
   * Get all conflicts in current schedule
   */
  getConflicts(): Conflict[] {
    const selections = storageService.getSelections();
    return conflictDetector.detectConflicts(selections);
  }

  /**
   * Get schedule statistics
   */
  getStats(): {
    total_selections: number;
    total_conflicts: number;
    dates: string[];
    venues: Set<string>;
  } {
    const selections = storageService.getSelections();
    const conflicts = this.getConflicts();
    const grouped = this.getGroupedSchedule();

    // Extract unique dates
    const dates = Array.from(grouped.keys()).sort();

    // Extract unique venues
    const venues = new Set<string>();
    selections.forEach(selection => {
      venues.add(selection.screening_snapshot.venue_name_en);
    });

    return {
      total_selections: selections.length,
      total_conflicts: conflicts.length,
      dates,
      venues
    };
  }
}

// Export both class and singleton instance
export { ScheduleService };
export const scheduleService = new ScheduleService();
export default scheduleService;
