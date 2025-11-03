# Review: Screening Selection and Scheduling Functions

**Date:** 2025-01-27  
**Reviewer:** AI Code Review  
**Application:** HKAFF 2025 Screening Selector  
**Dev Server:** http://localhost:5173

---

## Executive Summary

This review examines the screening selection and scheduling functions in the HKAFF 2025 Screening Selector application. The codebase demonstrates a well-structured architecture with clear separation of concerns between storage, conflict detection, and UI components. Overall, the implementation is solid, with a few areas for improvement identified.

### Strengths
- ✅ Clear separation of concerns (storage, scheduling, conflict detection)
- ✅ Comprehensive conflict detection with severity levels
- ✅ Robust error handling with user-friendly messages
- ✅ Proper use of React hooks (useMemo, useEffect) for performance
- ✅ Bilingual support (TC/EN) throughout
- ✅ Data persistence via localStorage with schema versioning

### Areas for Improvement
- ⚠️ Potential race condition in conflict gap calculation
- ⚠️ Missing validation for duplicate selections at UI level
- ⚠️ Performance optimization opportunity for large selection sets
- ⚠️ Incomplete venue data in `wouldConflict` temporary selection

---

## 1. Screening Selection Functions

### 1.1 `storageService.addSelection()`

**Location:** `frontend/src/services/storageService.ts:133-164`

**Functionality:**
- Adds a screening to user's selections in localStorage
- Creates a denormalized `UserSelection` snapshot
- Validates for duplicate selections

**Code Review:**
```typescript
addSelection(screening: Screening, film: Film, venue: Venue): UserSelection {
  const data = this.loadData();

  // Check if already selected
  if (data.selections.some(s => s.screening_id === screening.id)) {
    throw new Error(`Screening ${screening.id} is already selected`);
  }

  // Create UserSelection with denormalized snapshots
  const selection: UserSelection = {
    screening_id: screening.id,
    added_at: new Date().toISOString(),
    film_snapshot: {
      id: film.id,
      title_tc: film.title_tc,
      title_en: film.title_en,
      poster_url: film.poster_url
    },
    screening_snapshot: {
      id: screening.id,
      datetime: screening.datetime,
      duration_minutes: screening.duration_minutes,
      venue_name_tc: venue.name_tc,
      venue_name_en: venue.name_en
    }
  };

  data.selections.push(selection);
  this.saveData(data);

  return selection;
}
```

**Findings:**
- ✅ **Good:** Prevents duplicate selections with validation
- ✅ **Good:** Creates immutable snapshots for historical accuracy
- ✅ **Good:** Proper error throwing for duplicate attempts
- ⚠️ **Issue:** The duplicate check happens AFTER loading, but between load and save, another tab could add the same selection (race condition)
- 💡 **Recommendation:** Consider using a Set for O(1) duplicate checking instead of `some()` for O(n)

**Suggested Improvement:**
```typescript
// Use Set for faster duplicate checking
const existingIds = new Set(data.selections.map(s => s.screening_id));
if (existingIds.has(screening.id)) {
  throw new Error(`Screening ${screening.id} is already selected`);
}
```

---

### 1.2 `storageService.removeSelection()`

**Location:** `frontend/src/services/storageService.ts:171-183`

**Functionality:**
- Removes a screening from user's selections
- Returns boolean indicating success

**Code Review:**
```typescript
removeSelection(screeningId: string): boolean {
  const data = this.loadData();
  const initialLength = data.selections.length;

  data.selections = data.selections.filter(s => s.screening_id !== screeningId);

  if (data.selections.length < initialLength) {
    this.saveData(data);
    return true;
  }

  return false;
}
```

**Findings:**
- ✅ **Good:** Idempotent operation (safe to call multiple times)
- ✅ **Good:** Returns boolean for success indication
- ✅ **Good:** Only saves if actual change occurred
- ⚠️ **Minor:** Filter creates new array even if not found - could optimize with `findIndex` for early exit

---

### 1.3 `HKAFFScheduler.toggleScreening()`

**Location:** `frontend/src/components/HKAFFScheduler/HKAFFScheduler.tsx:121-154`

**Functionality:**
- Toggles screening selection state
- Updates local state and localStorage
- Shows toast notifications

**Code Review:**
```typescript
const toggleScreening = (screeningId: string) => {
  const screening = screeningsWithDetails.find(s => s.id === screeningId);
  if (!screening) return;

  try {
    if (selectedScreenings.includes(screeningId)) {
      // Remove selection
      storageService.removeSelection(screeningId);
      setSelectedScreenings(prev => prev.filter(id => id !== screeningId));
      showToast(
        isZh ? '已移除場次' : 'Screening removed',
        'info'
      );
    } else {
      // Add selection
      const venue = venues.find(v => v.id === screening.screening.venue_id);
      if (!venue) {
        throw new Error('Venue not found');
      }
      storageService.addSelection(screening.screening, screening.film, venue);
      setSelectedScreenings(prev => [...prev, screeningId]);
      showToast(
        isZh ? '已加入場次' : 'Screening added',
        'success'
      );
    }
  } catch (err) {
    console.error('Failed to toggle screening:', err);
    showToast(
      isZh ? '操作失敗，請重試' : 'Operation failed, please try again',
      'error'
    );
  }
};
```

**Findings:**
- ✅ **Good:** Comprehensive error handling with user feedback
- ✅ **Good:** Validates venue exists before adding
- ✅ **Good:** Optimistic UI updates with state management
- ⚠️ **Issue:** State update happens even if `storageService.addSelection()` throws (duplicate)
- 💡 **Recommendation:** Consider moving state update inside try block after successful storage operation, or use optimistic updates with rollback

**Suggested Improvement:**
```typescript
const toggleScreening = (screeningId: string) => {
  const screening = screeningsWithDetails.find(s => s.id === screeningId);
  if (!screening) return;

  const isSelected = selectedScreenings.includes(screeningId);
  
  try {
    if (isSelected) {
      storageService.removeSelection(screeningId);
      setSelectedScreenings(prev => prev.filter(id => id !== screeningId));
      showToast(isZh ? '已移除場次' : 'Screening removed', 'info');
    } else {
      const venue = venues.find(v => v.id === screening.screening.venue_id);
      if (!venue) {
        throw new Error('Venue not found');
      }
      // Update state only after successful storage operation
      storageService.addSelection(screening.screening, screening.film, venue);
      setSelectedScreenings(prev => [...prev, screeningId]);
      showToast(isZh ? '已加入場次' : 'Screening added', 'success');
    }
  } catch (err) {
    console.error('Failed to toggle screening:', err);
    // If error occurred, ensure state is in sync with storage
    const updatedSelections = storageService.getSelections();
    setSelectedScreenings(updatedSelections.map(s => s.screening_id));
    showToast(
      isZh ? '操作失敗，請重試' : 'Operation failed, please try again',
      'error'
    );
  }
};
```

---

### 1.4 `App.handleSelectScreening()`

**Location:** `frontend/src/App.tsx:458-499`

**Functionality:**
- Handles screening selection from FilmDetail modal
- Similar to `toggleScreening` but with different context

**Code Review:**
```typescript
const handleSelectScreening = (screening: Screening) => {
  try {
    const film = films.find(f => f.id === screening.film_id);
    const venue = venues.find(v => v.id === screening.venue_id);

    if (!film || !venue) {
      console.error('Film or venue not found');
      showToast(
        isZh ? '找不到電影或場地資訊' : 'Film or venue not found',
        'error'
      );
      return;
    }

    // Check if already selected
    if (storageService.isSelected(screening.id)) {
      // Remove selection
      storageService.removeSelection(screening.id);
      showToast(
        isZh ? '已移除場次' : 'Screening removed',
        'info'
      );
    } else {
      // Add selection
      storageService.addSelection(screening, film, venue);
      showToast(
        isZh ? '已加入場次' : 'Screening added',
        'success'
      );
    }

    // Refresh selections
    const updatedSelections = storageService.getSelections();
    setUserSelections(updatedSelections);
  } catch (err) {
    console.error('Failed to toggle screening:', err);
    showToast(
      isZh ? '操作失敗，請重試' : 'Operation failed, please try again',
      'error'
    );
  }
};
```

**Findings:**
- ✅ **Good:** Validates film and venue before proceeding
- ✅ **Good:** Refreshes state from storage after operation
- ⚠️ **Issue:** Uses `isSelected()` check but `addSelection()` also checks internally - redundant but safe
- ✅ **Good:** Always refreshes state from storage, ensuring consistency

---

## 2. Scheduling Functions

### 2.1 `scheduleService.getGroupedSchedule()`

**Location:** `frontend/src/services/scheduleService.ts:25-48`

**Functionality:**
- Groups user selections by date
- Sorts selections within each date by time

**Code Review:**
```typescript
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
```

**Findings:**
- ✅ **Good:** Uses Map for efficient date grouping
- ✅ **Good:** Sorts within each date group
- ⚠️ **Minor:** `split('T')[0]` assumes ISO format - could be more robust with date parsing
- 💡 **Recommendation:** Consider using `date-fns` format for consistency with rest of codebase

**Suggested Improvement:**
```typescript
import { format } from 'date-fns';

getGroupedSchedule(): Map<string, UserSelection[]> {
  const selections = storageService.getSelections();
  const grouped = new Map<string, UserSelection[]>();

  selections.forEach(selection => {
    const date = format(new Date(selection.screening_snapshot.datetime), 'yyyy-MM-dd');
    // ... rest of code
  });
}
```

---

### 2.2 `conflictDetector.detectConflicts()`

**Location:** `frontend/src/services/conflictDetector.ts:29-76`

**Functionality:**
- Detects conflicts between pairs of screenings
- Identifies overlaps (impossible) and tight timing (warning)

**Code Review:**
```typescript
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
        // Calculate gap (always positive since no overlap)
        const gap = Math.abs(b_start - a_end);

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
```

**Findings:**
- ✅ **Good:** O(n²) comparison is acceptable for reasonable selection sizes
- ✅ **Good:** Clear separation of overlap vs. travel time conflicts
- ⚠️ **Critical Issue:** Gap calculation uses `Math.abs(b_start - a_end)` which is incorrect for bidirectional travel time

**Problem:**
The gap calculation assumes `b_start` always comes after `a_end`, but this may not be true. The code handles overlap first, but the gap calculation doesn't consider which screening comes first.

**Example:**
- Screening A: 10:00-11:00
- Screening B: 10:30-11:30 (overlap detected ✓)
- Screening A: 10:00-11:00
- Screening B: 11:30-12:30 (gap = |11:30 - 11:00| = 30min ✓)
- Screening A: 11:00-12:00
- Screening B: 10:00-10:30 (gap = |10:00 - 12:00| = 120min ✗ should be 30min)

**Suggested Fix:**
```typescript
} else if (a.venue_name_en !== b.venue_name_en) {
  // Different venues - check for tight timing
  // Calculate gap considering both directions
  const gap = Math.min(
    Math.abs(b_start - a_end),  // B after A
    Math.abs(a_start - b_end)   // A after B
  );

  if (gap < TRAVEL_BUFFER_MS) {
    conflicts.push({
      screening_a: selections[i],
      screening_b: selections[j],
      overlap_minutes: 0,
      severity: 'warning'
    });
  }
}
```

**However,** since we already check for overlap first, if `overlapMinutes > 0`, we never reach this code. So the actual issue is: if `a_end < b_start`, then `Math.abs(b_start - a_end)` is correct. But if `b_end < a_start` (B ends before A starts), we still use `Math.abs(b_start - a_end)` which would be wrong.

**Actually, wait** - if there's no overlap, then either:
- `a_end <= b_start` (A ends before/at B starts) → gap = `b_start - a_end` ✓
- `b_end <= a_start` (B ends before/at A starts) → gap = `a_start - b_end` ✓

So the fix should be:
```typescript
} else if (a.venue_name_en !== b.venue_name_en) {
  // Different venues - check for tight timing
  let gap: number;
  if (a_end <= b_start) {
    // A ends before B starts
    gap = b_start - a_end;
  } else if (b_end <= a_start) {
    // B ends before A starts
    gap = a_start - b_end;
  } else {
    // This shouldn't happen (overlap already checked)
    gap = 0;
  }

  if (gap < TRAVEL_BUFFER_MS) {
    conflicts.push({
      screening_a: selections[i],
      screening_b: selections[j],
      overlap_minutes: 0,
      severity: 'warning'
    });
  }
}
```

---

### 2.3 `conflictDetector.wouldConflict()`

**Location:** `frontend/src/services/conflictDetector.ts:84-114`

**Functionality:**
- Checks if adding a new screening would create conflicts
- Used by `ScreeningSelector` for preview warnings

**Code Review:**
```typescript
wouldConflict(existingSelections: UserSelection[], newScreening: Screening): Conflict[] {
  // Create a temporary UserSelection for the new screening
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
      venue_name_tc: '',
      venue_name_en: ''
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
```

**Findings:**
- ✅ **Good:** Reuses `detectConflicts` logic
- ⚠️ **Issue:** Empty venue names (`venue_name_tc: '', venue_name_en: ''`) will cause issues in conflict detection
- ⚠️ **Issue:** Empty film titles may cause issues in conflict message formatting

**Problem:**
The `detectConflicts` method compares `a.venue_name_en !== b.venue_name_en` to determine if venues are different. With empty strings, this will incorrectly identify conflicts.

**Suggested Fix:**
The `wouldConflict` method should accept venue information as a parameter, or the Screening type should include venue information. Let's check the Screening type...

Looking at the usage in `ScreeningSelector.tsx:50`, we see:
```typescript
return conflictDetector.wouldConflict(existingSelections, screening);
```

But `screening` is of type `Screening`, which doesn't include venue info. We need to pass venue separately or look it up.

**Recommended Solution:**
```typescript
wouldConflict(
  existingSelections: UserSelection[], 
  newScreening: Screening,
  venueNameEn: string,
  venueNameTc: string
): Conflict[] {
  const tempSelection: UserSelection = {
    // ... existing code ...
    screening_snapshot: {
      id: newScreening.id,
      datetime: newScreening.datetime,
      duration_minutes: newScreening.duration_minutes,
      venue_name_tc: venueNameTc,
      venue_name_en: venueNameEn
    }
  };
  // ... rest of code
}
```

Or better, update the interface to accept a `UserSelection` instead of just `Screening`:
```typescript
wouldConflict(existingSelections: UserSelection[], newSelection: UserSelection): Conflict[]
```

---

### 2.4 `ScheduleView` Component

**Location:** `frontend/src/components/ScheduleView/ScheduleView.tsx`

**Functionality:**
- Displays user's schedule grouped by date
- Shows conflicts with visual indicators
- Provides schedule statistics

**Code Review Highlights:**

**Conflict Detection Integration:**
```typescript
// Convert Selection[] to UserSelection[] for conflictDetector
const userSelections: UserSelection[] = sorted.map(selection => ({
  screening_id: selection.screening_id,
  added_at: selection.added_at,
  film_snapshot: {
    id: selection.film_snapshot.id,
    title_tc: selection.film_snapshot.title_tc,
    title_en: selection.film_snapshot.title_en,
    poster_url: selection.film_snapshot.poster_url
  },
  screening_snapshot: {
    id: selection.screening_snapshot.id,
    datetime: selection.screening_snapshot.datetime,
    duration_minutes: selection.screening_snapshot.duration_minutes,
    venue_name_tc: selection.venue_snapshot.name_tc,
    venue_name_en: selection.venue_snapshot.name_en
  }
}));

// Detect conflicts using the conflictDetector service
const allConflicts = conflictDetector.detectConflicts(userSelections);
```

**Findings:**
- ✅ **Good:** Proper data transformation between component types and service types
- ✅ **Good:** Uses `useMemo` for performance optimization
- ✅ **Good:** Maps conflicts to screenings for efficient lookup
- ✅ **Good:** Visual conflict indicators in UI

---

## 3. Edge Cases and Error Handling

### 3.1 Duplicate Selection Prevention

**Current Implementation:**
- `storageService.addSelection()` throws error if duplicate
- UI components check `isSelected()` before calling `addSelection()`
- `HKAFFScheduler.toggleScreening()` doesn't check before calling

**Issues:**
- ⚠️ Race condition: Two tabs could add same selection simultaneously
- ⚠️ Inconsistent: Some components check, others don't

**Recommendation:**
- Always check `isSelected()` before attempting to add
- Consider using localStorage events to sync across tabs
- Add debouncing for rapid clicks

---

### 3.2 Missing Data Validation

**Issues Found:**
1. **Venue not found:** `HKAFFScheduler.toggleScreening()` handles this, but `App.handleSelectScreening()` also checks
2. **Film not found:** Only checked in `App.handleSelectScreening()`, not in `HKAFFScheduler.toggleScreening()`
3. **Empty venue names in `wouldConflict()`:** As discussed above

**Recommendation:**
- Add validation layer in `storageService.addSelection()` to ensure all required data exists
- Or create a validation helper function

---

### 3.3 Performance Considerations

**Current Performance:**
- Conflict detection: O(n²) - acceptable for <100 selections
- Filtering: O(n) - good
- Grouping: O(n) - good

**Potential Issues:**
- Large selection sets (>100) may cause UI lag
- `detectConflicts` is called on every render in `ScheduleView` (but memoized ✓)

**Recommendation:**
- Consider virtualizing schedule list if >50 items
- Add debouncing for conflict detection during rapid selections
- Consider Web Worker for conflict detection if >200 selections

---

## 4. Testing Observations

### 4.1 Browser Testing

**Tested Actions:**
1. ✅ Click "Add" button on film card → Success toast appears
2. ✅ Click "My Schedule" tab → Shows selected screening
3. ✅ Click "Remove" button → Removes from schedule
4. ✅ Modal opens with film details and screenings

**Issues Found:**
- ⚠️ No visible indication of selection state on film cards (button shows "Add" but doesn't change to "Remove")
- ⚠️ Schedule view shows empty state even after adding (needs refresh)

**Note:** The empty state issue may be due to state not syncing properly between components.

---

## 5. Recommendations Summary

### Priority 1 (Critical)
1. **Fix gap calculation in `detectConflicts()`** - Incorrect bidirectional gap calculation
2. **Fix empty venue names in `wouldConflict()`** - Pass venue information properly

### Priority 2 (Important)
3. **Improve state synchronization** - Ensure UI updates reflect storage changes immediately
4. **Add validation layer** - Centralize data validation in storage service
5. **Handle race conditions** - Consider localStorage sync events for multi-tab support

### Priority 3 (Nice to Have)
6. **Optimize duplicate checking** - Use Set instead of array.some()
7. **Add performance monitoring** - Log conflict detection times for large sets
8. **Improve error messages** - More specific error messages for different failure types

---

## 6. Code Quality Assessment

### Architecture: ⭐⭐⭐⭐⭐ (5/5)
- Excellent separation of concerns
- Clear service interfaces
- Proper dependency injection

### Error Handling: ⭐⭐⭐⭐ (4/5)
- Good error handling overall
- User-friendly messages
- Some edge cases not fully covered

### Performance: ⭐⭐⭐⭐ (4/5)
- Good use of React optimization
- Acceptable algorithms for expected use case
- Could optimize for edge cases

### Maintainability: ⭐⭐⭐⭐⭐ (5/5)
- Well-documented code
- Clear function names
- Consistent patterns

### Test Coverage: ⭐⭐⭐ (3/5)
- Unit tests exist for conflictDetector
- Need more integration tests
- Browser testing reveals UI issues

---

## Conclusion

The screening selection and scheduling functions are well-implemented with a solid architecture. The main issues are:
1. A bug in the gap calculation for travel time conflicts
2. Missing venue information in the `wouldConflict` method
3. Some state synchronization issues between components

These are fixable issues that don't compromise the core functionality. The codebase demonstrates good engineering practices and is maintainable.

**Overall Grade: A- (Excellent with minor improvements needed)**

