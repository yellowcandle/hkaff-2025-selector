/**
 * ConflictDetector Service - Detects scheduling conflicts between screenings
 *
 * Implements IConflictDetector interface from service-interfaces.ts
 * Business rules from data-model.md lines 235-275:
 * - True overlap: screenings at same time → "impossible" severity
 * - Tight timing: different venues, <30min gap → "warning" severity
 * - Same venue: same venue, <30min gap → OK (no warning)
 */

import type {
  Screening,
  UserSelection,
  Conflict,
  IConflictDetector
} from '../../../specs/001-given-this-film/contracts/service-interfaces';

const TRAVEL_BUFFER_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * ConflictDetector implementation
 */
class ConflictDetector implements IConflictDetector {
  /**
   * Detect all conflicts in a set of user selections
   * @param selections Array of user selections to analyze
   * @returns Array of detected conflicts (empty if none)
   */
  detectConflicts(selections: UserSelection[]): Conflict[] {
    const conflicts: Conflict[] = [];

    // Compare each pair of selections
    for (let i = 0; i < selections.length; i++) {
      for (let j = i + 1; j < selections.length; j++) {
        const a = selections[i].screening_snapshot;
        const b = selections[j].screening_snapshot;

        const a_start = new Date(a.datetime).getTime();
        const a_end = a_start + a.duration_minutes * 60000;
        const b_start = new Date(b.datetime).getTime();
        const b_end = b_start + b.duration_minutes * 60000;

        // Check for time overlap first
        const overlapStart = Math.max(a_start, b_start);
        const overlapEnd = Math.min(a_end, b_end);
        const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;

        if (overlapMinutes > 0) {
          // True overlap - impossible to attend both
          conflicts.push({
            screening_a: selections[i],
            screening_b: selections[j],
            overlap_minutes: overlapMinutes,
            severity: 'impossible'
          });
        } else if (a.venue_name_en !== b.venue_name_en) {
          // Different venues - check for tight timing
          // Calculate gap between screenings (bidirectional)
          // Since no overlap, either a_end <= b_start or b_end <= a_start
          let gap: number;
          if (a_end <= b_start) {
            // A ends before B starts
            gap = b_start - a_end;
          } else {
            // B ends before A starts (b_end <= a_start)
            gap = a_start - b_end;
          }

          if (gap < TRAVEL_BUFFER_MS) {
            // Less than 30 minutes between screenings at different venues
            conflicts.push({
              screening_a: selections[i],
              screening_b: selections[j],
              overlap_minutes: 0,
              severity: 'warning'
            });
          }
        }
        // Same venue with no overlap - no conflict
      }
    }

    return conflicts;
  }

  /**
   * Check if adding a new screening would create conflicts
   * @param existingSelections Current user selections
   * @param newScreening Screening being considered
   * @param venueNameEn Optional: English venue name (required for accurate conflict detection)
   * @param venueNameTc Optional: Traditional Chinese venue name
   * @returns Array of conflicts with the new screening
   */
  wouldConflict(
    existingSelections: UserSelection[], 
    newScreening: Screening,
    venueNameEn?: string,
    venueNameTc?: string
  ): Conflict[] {
    // Create a temporary UserSelection for the new screening
    // Note: If venue names are not provided, conflict detection may be inaccurate
    const tempSelection: UserSelection = {
      screening_id: newScreening.id,
      added_at: new Date().toISOString(),
      film_snapshot: {
        id: newScreening.film_id,
        title_tc: '',
        title_en: '',
        poster_url: ''
      },
      screening_snapshot: {
        id: newScreening.id,
        datetime: newScreening.datetime,
        duration_minutes: newScreening.duration_minutes,
        venue_name_tc: venueNameTc || '',
        venue_name_en: venueNameEn || ''
      }
    };

    // Add temp selection and detect conflicts
    const allSelections = [...existingSelections, tempSelection];
    const allConflicts = this.detectConflicts(allSelections);

    // Filter to only conflicts involving the new screening
    return allConflicts.filter(
      conflict =>
        conflict.screening_a.screening_id === newScreening.id ||
        conflict.screening_b.screening_id === newScreening.id
    );
  }

  /**
   * Calculate overlap between two screenings in minutes
   * @param a First screening
   * @param b Second screening
   * @returns Overlap in minutes (0 if no overlap)
   */
  calculateOverlap(a: Screening, b: Screening): number {
    const a_start = new Date(a.datetime).getTime();
    const a_end = a_start + a.duration_minutes * 60000;
    const b_start = new Date(b.datetime).getTime();
    const b_end = b_start + b.duration_minutes * 60000;

    const overlapStart = Math.max(a_start, b_start);
    const overlapEnd = Math.min(a_end, b_end);
    const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;

    return overlapMinutes;
  }

  /**
   * Check if two screenings overlap in time
   * @param a First screening
   * @param b Second screening
   */
  hasOverlap(a: Screening, b: Screening): boolean {
    return this.calculateOverlap(a, b) > 0;
  }
}

// Export both class and singleton instance
export { ConflictDetector };
export const conflictDetector = new ConflictDetector();
export default conflictDetector;
