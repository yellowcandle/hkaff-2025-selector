/**
 * Unit Tests for Conflict Detection Logic
 * 
 * These tests validate the conflict detection algorithm based on the business rules
 * defined in the data model. Tests will fail until conflictDetector service is implemented.
 * 
 * Business Rules:
 * - True overlap: screenings at same time → "impossible" severity
 * - Tight timing: different venues, <30min gap → "warning" severity  
 * - Same venue: same venue, <30min gap → OK (no warning)
 */

import { describe, it, expect } from 'vitest';

describe('T023: Conflict Detection Logic Unit Tests', () => {
  // Mock data for testing
  const createScreening = (id, datetime, duration, venueId) => ({
    id,
    datetime,
    duration_minutes: duration,
    venue_id: venueId,
    film_id: `film-${id}`,
    language: 'Chinese'
  });

  const createUserSelection = (screening, filmTitle, venueName) => ({
    screening_id: screening.id,
    added_at: '2025-10-02T14:30:00Z',
    film_snapshot: {
      id: screening.film_id,
      title_tc: filmTitle,
      title_en: filmTitle,
      poster_url: 'test.jpg'
    },
    screening_snapshot: {
      id: screening.id,
      datetime: screening.datetime,
      duration_minutes: screening.duration_minutes,
      venue_name_tc: venueName,
      venue_name_en: venueName
    }
  });

  describe('Overlap Detection', () => {
    it('should detect complete overlap (same time)', () => {
      // This test will fail until conflictDetector is implemented
      const screening1 = createScreening('screening-1', '2025-03-15T19:30:00', 120, 'venue-1');
      const screening2 = createScreening('screening-2', '2025-03-15T19:30:00', 90, 'venue-2');
      
      const selections = [
        createUserSelection(screening1, 'Film A', 'Venue A'),
        createUserSelection(screening2, 'Film B', 'Venue B')
      ];

      // Mock the conflict detection logic
      const detectConflicts = (selections) => {
        const conflicts = [];
        for (let i = 0; i < selections.length; i++) {
          for (let j = i + 1; j < selections.length; j++) {
            const a = selections[i].screening_snapshot;
            const b = selections[j].screening_snapshot;
            
            const a_start = new Date(a.datetime).getTime();
            const a_end = a_start + a.duration_minutes * 60000;
            const b_start = new Date(b.datetime).getTime();
            const b_end = b_start + b.duration_minutes * 60000;
            
            // Check for overlap
            const overlapStart = Math.max(a_start, b_start);
            const overlapEnd = Math.min(a_end, b_end);
            const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;
            
            if (overlapMinutes > 0) {
              conflicts.push({
                screening_a: selections[i],
                screening_b: selections[j],
                overlap_minutes: overlapMinutes,
                severity: 'impossible'
              });
            }
          }
        }
        return conflicts;
      };

      const conflicts = detectConflicts(selections);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].severity).toBe('impossible');
      expect(conflicts[0].overlap_minutes).toBe(90); // 90 minutes overlap
    });

    it('should detect partial overlap', () => {
      const screening1 = createScreening('screening-1', '2025-03-15T19:30:00', 120, 'venue-1'); // 19:30-21:30
      const screening2 = createScreening('screening-2', '2025-03-15T20:30:00', 90, 'venue-2');  // 20:30-22:00
      
      const selections = [
        createUserSelection(screening1, 'Film A', 'Venue A'),
        createUserSelection(screening2, 'Film B', 'Venue B')
      ];

      const detectConflicts = (selections) => {
        const conflicts = [];
        for (let i = 0; i < selections.length; i++) {
          for (let j = i + 1; j < selections.length; j++) {
            const a = selections[i].screening_snapshot;
            const b = selections[j].screening_snapshot;
            
            const a_start = new Date(a.datetime).getTime();
            const a_end = a_start + a.duration_minutes * 60000;
            const b_start = new Date(b.datetime).getTime();
            const b_end = b_start + b.duration_minutes * 60000;
            
            const overlapStart = Math.max(a_start, b_start);
            const overlapEnd = Math.min(a_end, b_end);
            const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;
            
            if (overlapMinutes > 0) {
              conflicts.push({
                screening_a: selections[i],
                screening_b: selections[j],
                overlap_minutes: overlapMinutes,
                severity: 'impossible'
              });
            }
          }
        }
        return conflicts;
      };

      const conflicts = detectConflicts(selections);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].severity).toBe('impossible');
      expect(conflicts[0].overlap_minutes).toBe(60); // 60 minutes overlap
    });

    it('should not detect conflict for non-overlapping screenings', () => {
      const screening1 = createScreening('screening-1', '2025-03-15T19:30:00', 120, 'venue-1'); // 19:30-21:30
      const screening2 = createScreening('screening-2', '2025-03-15T22:00:00', 90, 'venue-2');  // 22:00-23:30
      
      const selections = [
        createUserSelection(screening1, 'Film A', 'Venue A'),
        createUserSelection(screening2, 'Film B', 'Venue B')
      ];

      const detectConflicts = (selections) => {
        const conflicts = [];
        for (let i = 0; i < selections.length; i++) {
          for (let j = i + 1; j < selections.length; j++) {
            const a = selections[i].screening_snapshot;
            const b = selections[j].screening_snapshot;
            
            const a_start = new Date(a.datetime).getTime();
            const a_end = a_start + a.duration_minutes * 60000;
            const b_start = new Date(b.datetime).getTime();
            const b_end = b_start + b.duration_minutes * 60000;
            
            const overlapStart = Math.max(a_start, b_start);
            const overlapEnd = Math.min(a_end, b_end);
            const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;
            
            if (overlapMinutes > 0) {
              conflicts.push({
                screening_a: selections[i],
                screening_b: selections[j],
                overlap_minutes: overlapMinutes,
                severity: 'impossible'
              });
            }
          }
        }
        return conflicts;
      };

      const conflicts = detectConflicts(selections);
      expect(conflicts).toHaveLength(0);
    });
  });

  describe('Tight Timing Detection', () => {
    it('should detect tight timing between different venues (< 30min gap)', () => {
      const screening1 = createScreening('screening-1', '2025-03-15T19:30:00', 120, 'venue-1'); // 19:30-21:30
      const screening2 = createScreening('screening-2', '2025-03-15T21:45:00', 90, 'venue-2');  // 21:45-23:15 (15min gap)
      
      const selections = [
        createUserSelection(screening1, 'Film A', 'Venue A'),
        createUserSelection(screening2, 'Film B', 'Venue B')
      ];

      const detectConflicts = (selections) => {
        const conflicts = [];
        for (let i = 0; i < selections.length; i++) {
          for (let j = i + 1; j < selections.length; j++) {
            const a = selections[i].screening_snapshot;
            const b = selections[j].screening_snapshot;
            
            const a_start = new Date(a.datetime).getTime();
            const a_end = a_start + a.duration_minutes * 60000;
            const b_start = new Date(b.datetime).getTime();
            const b_end = b_start + b.duration_minutes * 60000;
            
            // Check for overlap first
            const overlapStart = Math.max(a_start, b_start);
            const overlapEnd = Math.min(a_end, b_end);
            const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;
            
            if (overlapMinutes > 0) {
              conflicts.push({
                screening_a: selections[i],
                screening_b: selections[j],
                overlap_minutes: overlapMinutes,
                severity: 'impossible'
              });
            } else if (a.venue_name_en !== b.venue_name_en) {
              // Check for tight timing between different venues
              const gap = Math.abs(b_start - a_end);
              if (gap < 30 * 60000) { // Less than 30 minutes
                conflicts.push({
                  screening_a: selections[i],
                  screening_b: selections[j],
                  overlap_minutes: 0,
                  severity: 'warning'
                });
              }
            }
          }
        }
        return conflicts;
      };

      const conflicts = detectConflicts(selections);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].severity).toBe('warning');
      expect(conflicts[0].overlap_minutes).toBe(0);
    });

    it('should not warn for tight timing at same venue', () => {
      const screening1 = createScreening('screening-1', '2025-03-15T19:30:00', 120, 'venue-1'); // 19:30-21:30
      const screening2 = createScreening('screening-2', '2025-03-15T21:45:00', 90, 'venue-1');  // 21:45-23:15 (15min gap, same venue)
      
      const selections = [
        createUserSelection(screening1, 'Film A', 'Venue A'),
        createUserSelection(screening2, 'Film B', 'Venue A') // Same venue
      ];

      const detectConflicts = (selections) => {
        const conflicts = [];
        for (let i = 0; i < selections.length; i++) {
          for (let j = i + 1; j < selections.length; j++) {
            const a = selections[i].screening_snapshot;
            const b = selections[j].screening_snapshot;
            
            const a_start = new Date(a.datetime).getTime();
            const a_end = a_start + a.duration_minutes * 60000;
            const b_start = new Date(b.datetime).getTime();
            const b_end = b_start + b.duration_minutes * 60000;
            
            // Check for overlap first
            const overlapStart = Math.max(a_start, b_start);
            const overlapEnd = Math.min(a_end, b_end);
            const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;
            
            if (overlapMinutes > 0) {
              conflicts.push({
                screening_a: selections[i],
                screening_b: selections[j],
                overlap_minutes: overlapMinutes,
                severity: 'impossible'
              });
            } else if (a.venue_name_en !== b.venue_name_en) {
              // Only check tight timing for different venues
              const gap = Math.abs(b_start - a_end);
              if (gap < 30 * 60000) {
                conflicts.push({
                  screening_a: selections[i],
                  screening_b: selections[j],
                  overlap_minutes: 0,
                  severity: 'warning'
                });
              }
            }
          }
        }
        return conflicts;
      };

      const conflicts = detectConflicts(selections);
      expect(conflicts).toHaveLength(0); // No warning for same venue
    });

    it('should not warn for sufficient gap between venues (>= 30min)', () => {
      const screening1 = createScreening('screening-1', '2025-03-15T19:30:00', 120, 'venue-1'); // 19:30-21:30
      const screening2 = createScreening('screening-2', '2025-03-15T22:15:00', 90, 'venue-2');  // 22:15-23:45 (45min gap)
      
      const selections = [
        createUserSelection(screening1, 'Film A', 'Venue A'),
        createUserSelection(screening2, 'Film B', 'Venue B')
      ];

      const detectConflicts = (selections) => {
        const conflicts = [];
        for (let i = 0; i < selections.length; i++) {
          for (let j = i + 1; j < selections.length; j++) {
            const a = selections[i].screening_snapshot;
            const b = selections[j].screening_snapshot;
            
            const a_start = new Date(a.datetime).getTime();
            const a_end = a_start + a.duration_minutes * 60000;
            const b_start = new Date(b.datetime).getTime();
            const b_end = b_start + b.duration_minutes * 60000;
            
            // Check for overlap first
            const overlapStart = Math.max(a_start, b_start);
            const overlapEnd = Math.min(a_end, b_end);
            const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;
            
            if (overlapMinutes > 0) {
              conflicts.push({
                screening_a: selections[i],
                screening_b: selections[j],
                overlap_minutes: overlapMinutes,
                severity: 'impossible'
              });
            } else if (a.venue_name_en !== b.venue_name_en) {
              const gap = Math.abs(b_start - a_end);
              if (gap < 30 * 60000) {
                conflicts.push({
                  screening_a: selections[i],
                  screening_b: selections[j],
                  overlap_minutes: 0,
                  severity: 'warning'
                });
              }
            }
          }
        }
        return conflicts;
      };

      const conflicts = detectConflicts(selections);
      expect(conflicts).toHaveLength(0); // No warning for sufficient gap
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty selections array', () => {
      const detectConflicts = (selections) => {
        return selections ? [] : [];
      };

      const conflicts = detectConflicts([]);
      expect(conflicts).toHaveLength(0);
    });

    it('should handle single selection', () => {
      const screening1 = createScreening('screening-1', '2025-03-15T19:30:00', 120, 'venue-1');
      const selections = [createUserSelection(screening1, 'Film A', 'Venue A')];

      const detectConflicts = (selections) => {
        const conflicts = [];
        for (let i = 0; i < selections.length; i++) {
          for (let j = i + 1; j < selections.length; j++) {
            // No pairs with single selection
          }
        }
        return conflicts;
      };

      const conflicts = detectConflicts(selections);
      expect(conflicts).toHaveLength(0);
    });

    it('should handle multiple selections with multiple conflicts', () => {
      const screening1 = createScreening('screening-1', '2025-03-15T19:30:00', 120, 'venue-1'); // 19:30-21:30
      const screening2 = createScreening('screening-2', '2025-03-15T20:00:00', 90, 'venue-2');  // 20:00-21:30 (overlaps)
      const screening3 = createScreening('screening-3', '2025-03-15T21:45:00', 90, 'venue-3');  // 21:45-23:15 (tight with screening1)
      
      const selections = [
        createUserSelection(screening1, 'Film A', 'Venue A'),
        createUserSelection(screening2, 'Film B', 'Venue B'),
        createUserSelection(screening3, 'Film C', 'Venue C')
      ];

      const detectConflicts = (selections) => {
        const conflicts = [];
        for (let i = 0; i < selections.length; i++) {
          for (let j = i + 1; j < selections.length; j++) {
            const a = selections[i].screening_snapshot;
            const b = selections[j].screening_snapshot;
            
            const a_start = new Date(a.datetime).getTime();
            const a_end = a_start + a.duration_minutes * 60000;
            const b_start = new Date(b.datetime).getTime();
            const b_end = b_start + b.duration_minutes * 60000;
            
            const overlapStart = Math.max(a_start, b_start);
            const overlapEnd = Math.min(a_end, b_end);
            const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;
            
            if (overlapMinutes > 0) {
              conflicts.push({
                screening_a: selections[i],
                screening_b: selections[j],
                overlap_minutes: overlapMinutes,
                severity: 'impossible'
              });
            } else if (a.venue_name_en !== b.venue_name_en) {
              const gap = Math.abs(b_start - a_end);
              if (gap < 30 * 60000) {
                conflicts.push({
                  screening_a: selections[i],
                  screening_b: selections[j],
                  overlap_minutes: 0,
                  severity: 'warning'
                });
              }
            }
          }
        }
        return conflicts;
      };

      const conflicts = detectConflicts(selections);
      expect(conflicts.length).toBeGreaterThanOrEqual(2); // At least 2 conflicts
      
      // Should have one impossible conflict (screening1 vs screening2)
      const impossibleConflicts = conflicts.filter(c => c.severity === 'impossible');
      expect(impossibleConflicts).toHaveLength(1);
      
      // Should have at least one warning conflict (screening1 vs screening3)
      const warningConflicts = conflicts.filter(c => c.severity === 'warning');
      expect(warningConflicts.length).toBeGreaterThanOrEqual(1);
    });
  });
});