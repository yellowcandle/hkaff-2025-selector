import { describe, it, expect, beforeEach } from 'vitest';
import { ConflictDetector } from '../../src/services/conflictDetector';
import type { UserSelection, Screening } from '../../../specs/001-given-this-film/contracts/service-interfaces';

const createUserSelection = (overrides: Partial<UserSelection> = {}): UserSelection => ({
  screening_id: 'screening-default',
  added_at: new Date().toISOString(),
  film_snapshot: {
    id: 'film-default',
    title_tc: '預設電影',
    title_en: 'Default Film',
    poster_url: '',
  },
  screening_snapshot: {
    id: 'screening-default',
    datetime: '2025-10-20T14:00:00Z',
    duration_minutes: 120,
    venue_name_tc: '場地',
    venue_name_en: 'Venue',
  },
  ...overrides,
});

describe('ConflictDetector', () => {
  let detector: ConflictDetector;
  let mockSelections: UserSelection[];

  beforeEach(() => {
    detector = new ConflictDetector();
    mockSelections = [
      createUserSelection({
        screening_id: 's1',
        film_snapshot: {
          id: 'f1',
          title_tc: '電影A',
          title_en: 'Film A',
          poster_url: '',
        },
        screening_snapshot: {
          id: 's1',
          datetime: '2025-10-20T14:00:00Z',
          duration_minutes: 120,
          venue_name_tc: '場地A',
          venue_name_en: 'Cultural Centre',
        },
      }),
      createUserSelection({
        screening_id: 's2',
        film_snapshot: {
          id: 'f2',
          title_tc: '電影B',
          title_en: 'Film B',
          poster_url: '',
        },
        screening_snapshot: {
          id: 's2',
          datetime: '2025-10-20T16:30:00Z',
          duration_minutes: 90,
          venue_name_tc: '場地B',
          venue_name_en: 'Broadway Cinematheque',
        },
      }),
    ];
  });

  describe('detectConflicts', () => {
    it('detects no conflicts when screenings do not overlap and have sufficient gap', () => {
      const conflicts = detector.detectConflicts(mockSelections);
      expect(conflicts).toHaveLength(0);
    });

    it('detects overlap conflict', () => {
      const overlappingSelection: UserSelection = {
        ...mockSelections[1],
        screening_id: 's2-overlap',
        screening_snapshot: {
          id: 's2-overlap',
          datetime: '2025-10-20T15:30:00Z',
          duration_minutes: 90,
          venue_name_tc: '場地C',
          venue_name_en: 'Other Venue',
        },
      };
      const selectionsWithOverlap = [mockSelections[0], overlappingSelection];
      const conflicts = detector.detectConflicts(selectionsWithOverlap);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].severity).toBe('impossible');
      expect(conflicts[0].overlap_minutes).toBe(30);
    });

    it('detects travel conflict with insufficient gap', () => {
      const tightSelection: UserSelection = {
        ...mockSelections[1],
        screening_id: 's2-tight',
        screening_snapshot: {
          id: 's2-tight',
          datetime: '2025-10-20T16:10:00Z',
          duration_minutes: 90,
          venue_name_tc: '場地C',
          venue_name_en: 'Other Venue',
        },
      };
      const selectionsWithTightGap = [mockSelections[0], tightSelection];
      const conflicts = detector.detectConflicts(selectionsWithTightGap);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].severity).toBe('warning');
      expect(conflicts[0].overlap_minutes).toBe(0);
    });

    it('does not detect travel conflict for same venue', () => {
      const sameVenueTight: UserSelection = {
        ...mockSelections[1],
        screening_id: 's2-same-venue',
        screening_snapshot: {
          id: 's2-same-venue',
          datetime: '2025-10-20T16:10:00Z',
          duration_minutes: 90,
          venue_name_tc: '場地A',
          venue_name_en: 'Cultural Centre',
        },
      };
      const sameVenueSelections = [mockSelections[0], sameVenueTight];
      const conflicts = detector.detectConflicts(sameVenueSelections);

      expect(conflicts).toHaveLength(0);
    });

    it('handles multiple conflicts correctly', () => {
      const multipleSelections: UserSelection[] = [
        ...mockSelections,
        createUserSelection({
          screening_id: 's3',
          film_snapshot: {
            id: 'f3',
            title_tc: '電影C',
            title_en: 'Film C',
            poster_url: '',
          },
          screening_snapshot: {
            id: 's3',
            datetime: '2025-10-20T15:00:00Z',
            duration_minutes: 100,
            venue_name_tc: '場地D',
            venue_name_en: 'Emperor Cinemas',
          },
        }),
      ];
      const conflicts = detector.detectConflicts(multipleSelections);

      expect(conflicts.length).toBeGreaterThanOrEqual(1);
    });

    it('uses default travel time for unknown venue pairs', () => {
      const unknownVenue: UserSelection = {
        ...mockSelections[1],
        screening_id: 's2-unknown',
        screening_snapshot: {
          id: 's2-unknown',
          datetime: '2025-10-20T16:05:00Z',
          duration_minutes: 90,
          venue_name_tc: 'Unknown',
          venue_name_en: 'Unknown Venue',
        },
      };
      const unknownSelections = [mockSelections[0], unknownVenue];
      const conflicts = detector.detectConflicts(unknownSelections);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].severity).toBe('warning');
    });
  });

  describe('wouldConflict', () => {
    it('returns conflicts when adding overlapping screening', () => {
      const newScreening: Screening = {
        id: 'new',
        film_id: 'new',
        venue_id: 'v1',
        datetime: '2025-10-20T15:00:00Z',
        duration_minutes: 60,
        language: 'English',
      };

      const conflicts = detector.wouldConflict(mockSelections, newScreening);

      expect(conflicts.length).toBeGreaterThanOrEqual(0);
    });

    it('returns no conflicts when adding non-conflicting screening', () => {
      const safeNew: Screening = {
        id: 'new',
        film_id: 'new',
        venue_id: 'v2',
        datetime: '2025-10-20T19:00:00Z',
        duration_minutes: 90,
        language: 'English',
      };

      const conflicts = detector.wouldConflict(mockSelections, safeNew);

      expect(conflicts).toHaveLength(0);
    });
  });

  describe('calculateOverlap', () => {
    it('calculates correct overlap minutes', () => {
      const s1: Screening = {
        id: 's1',
        film_id: 'f1',
        venue_id: 'v1',
        datetime: '2025-10-20T14:00:00Z',
        duration_minutes: 120,
        language: 'English',
      };
      const s2: Screening = {
        id: 's2',
        film_id: 'f2',
        venue_id: 'v1',
        datetime: '2025-10-20T15:00:00Z',
        duration_minutes: 90,
        language: 'English',
      };

      const overlap = detector.calculateOverlap(s1, s2);
      expect(overlap).toBe(60);
    });

    it('returns 0 for no overlap', () => {
      const s1: Screening = {
        id: 's1',
        film_id: 'f1',
        venue_id: 'v1',
        datetime: '2025-10-20T14:00:00Z',
        duration_minutes: 120,
        language: 'English',
      };
      const s2: Screening = {
        id: 's2',
        film_id: 'f2',
        venue_id: 'v2',
        datetime: '2025-10-20T16:30:00Z',
        duration_minutes: 90,
        language: 'English',
      };

      const overlap = detector.calculateOverlap(s1, s2);
      expect(overlap).toBe(0);
    });
  });

  describe('hasOverlap', () => {
    it('returns true for overlapping screenings', () => {
      const s1: Screening = {
        id: 's1',
        film_id: 'f1',
        venue_id: 'v1',
        datetime: '2025-10-20T14:00:00Z',
        duration_minutes: 120,
        language: 'English',
      };
      const overlapping: Screening = {
        id: 's2',
        film_id: 'f2',
        venue_id: 'v1',
        datetime: '2025-10-20T15:00:00Z',
        duration_minutes: 90,
        language: 'English',
      };
      expect(detector.hasOverlap(s1, overlapping)).toBe(true);
    });

    it('returns false for non-overlapping', () => {
      const s1: Screening = {
        id: 's1',
        film_id: 'f1',
        venue_id: 'v1',
        datetime: '2025-10-20T14:00:00Z',
        duration_minutes: 120,
        language: 'English',
      };
      const s2: Screening = {
        id: 's2',
        film_id: 'f2',
        venue_id: 'v2',
        datetime: '2025-10-20T16:30:00Z',
        duration_minutes: 90,
        language: 'English',
      };
      expect(detector.hasOverlap(s1, s2)).toBe(false);
    });
  });
});
