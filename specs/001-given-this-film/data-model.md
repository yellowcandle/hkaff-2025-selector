# Data Model: HKAFF Screening Selector

**Feature**: 001-given-this-film  
**Date**: 2025-10-02

## Entity Definitions

### Film

Represents a movie in the Hong Kong Asian Film Festival 2025 catalogue.

**Attributes**:
```typescript
interface Film {
  id: string;                 // Unique identifier (e.g., "film-376")
  title_tc: string;           // Traditional Chinese title (required)
  title_en: string;           // English title (required)
  category_id: string;        // Foreign key to Category
  synopsis_tc: string;        // Traditional Chinese synopsis
  synopsis_en: string;        // English synopsis
  runtime_minutes: number;    // Duration in minutes (>0)
  director: string;           // Director name
  country: string;            // Country of origin
  poster_url: string;         // URL to poster image
  detail_url_tc: string;      // Link to TC detail page
  detail_url_en: string;      // Link to EN detail page
}
```

**Validation Rules**:
- `id`: Must be unique, non-empty
- `title_tc`, `title_en`: Required, non-empty strings
- `category_id`: Must reference existing Category
- `runtime_minutes`: Must be positive integer
- `poster_url`: Must be valid URL or relative path

**Relationships**:
- One Film has many Screenings (1:N)
- One Film belongs to one Category (N:1)

---

### Screening

Represents a specific showing of a film at a venue and time.

**Attributes**:
```typescript
interface Screening {
  id: string;                 // Unique identifier (e.g., "screening-1001")
  film_id: string;            // Foreign key to Film
  venue_id: string;           // Foreign key to Venue
  datetime: string;           // ISO 8601 datetime (e.g., "2025-03-15T19:30:00")
  duration_minutes: number;   // Screening duration (typically matches film runtime)
  language: string;           // Audio/subtitle info (optional)
}
```

**Validation Rules**:
- `id`: Must be unique, non-empty
- `film_id`: Must reference existing Film
- `venue_id`: Must reference existing Venue
- `datetime`: Must be valid ISO 8601 datetime string
- `duration_minutes`: Must be positive integer
- `datetime` must be chronologically valid (not in past relative to festival dates)

**Relationships**:
- One Screening belongs to one Film (N:1)
- One Screening belongs to one Venue (N:1)

**Derived Data**:
- `end_datetime`: Calculated as `datetime + duration_minutes` (for conflict detection)
- `date`: Extracted date component for grouping

---

### Venue

Represents a cinema location where screenings occur.

**Attributes**:
```typescript
interface Venue {
  id: string;                 // Unique identifier (e.g., "venue-36")
  name_tc: string;            // Traditional Chinese name (required)
  name_en: string;            // English name (required)
  address_tc: string;         // Traditional Chinese address (optional)
  address_en: string;         // English address (optional)
  map_url: string;            // Google Maps link (optional)
}
```

**Validation Rules**:
- `id`: Must be unique, non-empty
- `name_tc`, `name_en`: Required, non-empty strings

**Relationships**:
- One Venue has many Screenings (1:N)

**Known Venues** (from website scrape):
1. Broadway Cinematheque (百老匯電影中心)
2. PREMIERE ELEMENTS
3. MOViE MOViE Pacific Place
4. MOViE MOViE Cityplaza
5. GALA CINEMA
6. PALACE ifc
7. MY CINEMA YOHO MALL
8. B+ cinema apm

---

### Category

Represents a festival section/programme grouping.

**Attributes**:
```typescript
interface Category {
  id: string;                 // Unique identifier (e.g., "category-67")
  name_tc: string;            // Traditional Chinese name (required)
  name_en: string;            // English name (required)
  sort_order: number;         // Display order (ascending)
  description_tc?: string;    // Optional description
  description_en?: string;    // Optional description
}
```

**Validation Rules**:
- `id`: Must be unique, non-empty
- `name_tc`, `name_en`: Required, non-empty strings
- `sort_order`: Non-negative integer, unique within categories

**Relationships**:
- One Category has many Films (1:N)

**Known Categories** (from website scrape):
1. Opening Film (開幕電影)
2. Mystery Screening (神秘場)
3. Closing Film (閉幕電影)
4. Special Presentations (隆重呈獻)
5. Special Recommendations (特別推介)
6. Hong Kong Short Short (香港Short Short地)
7. Asian New Talent Award (亞洲新導演獎)
8. Fan Favorites (影迷別注)
9. Focus: Director Nawapol Thamrongrattanarit (焦點導演：納華普譚容格坦拿列)
10. Yoshiharu Tsuge Anthology (跅跅步柘植義春)
11. Asian Animation: Love & Fear (亞洲動畫愛與懼)
12. Wide Angle (廣角視野)
13. Gaza Daily (加沙日常)
14. Documentary Eye (紀錄之眼)
15. Forest Voices - HKAFF X Greenpeace (森之聲——HKAFF X 綠色和平電影精選)

---

### UserSelection

Represents a user's selection of a screening (device-specific, persisted in LocalStorage).

**Attributes**:
```typescript
interface UserSelection {
  screening_id: string;       // Foreign key to Screening
  added_at: string;           // ISO 8601 timestamp when selection was made
  
  // Denormalized data (for persistence resilience)
  film_snapshot: {
    id: string;
    title_tc: string;
    title_en: string;
    poster_url: string;
  };
  screening_snapshot: {
    id: string;
    datetime: string;
    duration_minutes: number;
    venue_name_tc: string;
    venue_name_en: string;
  };
}
```

**Validation Rules**:
- `screening_id`: Must exist in loaded screenings data
- `added_at`: Valid ISO 8601 timestamp
- Denormalized snapshots: Preserve original data even if source data changes

**Relationships**:
- Conceptually belongs to one Screening (N:1), but denormalized for robustness

**State Transitions**:
```
[none] ---(user selects screening)---> [selected] ---(user removes)---> [none]
```

**Storage Schema**:
```typescript
interface LocalStorageSchema {
  version: number;            // Schema version (current: 1)
  last_updated: string;       // ISO 8601 timestamp
  selections: UserSelection[];
  preferences: {
    language: 'tc' | 'en';    // Last selected language
  };
}
```

---

### Schedule (Virtual Entity)

Represents a user's personalized schedule. Not stored directly - computed from UserSelection array.

**Computed Attributes**:
```typescript
interface Schedule {
  selections: UserSelection[];          // All selected screenings
  grouped_by_date: Map<string, UserSelection[]>;  // Screenings grouped by date
  conflicts: Conflict[];                // Detected overlapping screenings
}

interface Conflict {
  screening_a: UserSelection;
  screening_b: UserSelection;
  overlap_minutes: number;              // How much they overlap
  severity: 'warning' | 'impossible';   // Warning: tight timing, Impossible: true overlap
}
```

**Business Rules**:
- **Grouping**: Group by date component of `screening_snapshot.datetime`
- **Ordering**: Within each date group, sort by `screening_snapshot.datetime` ascending
- **Conflict Detection**: Two screenings conflict if their time intervals overlap OR gap between them is <30 minutes (travel time)

**Conflict Detection Algorithm**:
```typescript
function detectConflicts(selections: UserSelection[]): Conflict[] {
  const conflicts = [];
  for (let i = 0; i < selections.length; i++) {
    for (let j = i + 1; j < selections.length; j++) {
      const a = selections[i].screening_snapshot;
      const b = selections[j].screening_snapshot;
      
      const a_end = new Date(a.datetime).getTime() + a.duration_minutes * 60000;
      const b_start = new Date(b.datetime).getTime();
      const b_end = b_start + b.duration_minutes * 60000;
      
      // Check for overlap
      if (areIntervalsOverlapping(
        { start: new Date(a.datetime), end: new Date(a_end) },
        { start: new Date(b.datetime), end: new Date(b_end) }
      )) {
        conflicts.push({
          screening_a: selections[i],
          screening_b: selections[j],
          overlap_minutes: calculateOverlap(a, b),
          severity: 'impossible'
        });
      }
      // Check for tight timing (same venue, <30min gap OK; different venue, need buffer)
      else if (a.venue_name_en !== b.venue_name_en) {
        const gap = b_start - a_end;
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
}
```

---

## Data Relationships Diagram

```
Category (1) ----< Film (N)
                     |
                     | (1)
                     v
Venue (1) ----< Screening (N) >---- UserSelection (N)
                                         |
                                         v
                                   Schedule (computed)
```

---

## Data Volume Estimates

Based on HKAFF 2025 website analysis:

| Entity | Estimated Count | Notes |
|--------|-----------------|-------|
| Film | 80-100 | Paginated across 7 pages |
| Screening | 300-400 | Multiple showtimes per film across 8 venues |
| Venue | 8 | Fixed list from website |
| Category | 15 | Fixed list from website |
| UserSelection | 0-50 per user | Typical festival attendee selects 5-20 films |

**Total Static Data Size**: ~500KB JSON (uncompressed), ~150KB gzipped

**LocalStorage Usage**: ~5-10KB per user (well under 5MB limit)

---

## Data Integrity Rules

1. **Referential Integrity**:
   - All `film_id` in Screening must exist in Film
   - All `venue_id` in Screening must exist in Venue
   - All `category_id` in Film must exist in Category

2. **Temporal Consistency**:
   - Screening `datetime` must be within festival dates (March 2025)
   - UserSelection `added_at` must be <= current time

3. **Conflict Constraints**:
   - System MUST allow conflicting selections (spec requirement)
   - System MUST warn user about conflicts but not prevent them

4. **Data Snapshot Immutability**:
   - Once a UserSelection is created, its `film_snapshot` and `screening_snapshot` never change
   - If source screening data is updated, old selections preserve original data

---

## Migration Strategy

For future schema changes:

```typescript
function migrateUserData(data: any): LocalStorageSchema {
  if (!data || !data.version) {
    // v0 -> v1: Initial migration
    return {
      version: 1,
      last_updated: new Date().toISOString(),
      selections: data?.selections || [],
      preferences: { language: 'tc' }
    };
  }
  
  // Future migrations: v1 -> v2, v2 -> v3, etc.
  return data;
}
```

---

**Phase 1 Status**: Data model complete. Ready for contract generation.
