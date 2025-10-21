# Data Model: Frontend UI Rewrite Using Figma Mockup

## Overview
The data model remains unchanged from the existing application. Film data is sourced from static JSON files, while user preferences and schedules are stored in LocalStorage. The UI rewrite does not introduce new data entities or modify existing schemas.

## Entities

### Film
**Source**: Static JSON (`dist/data/films.json`)  
**Purpose**: Core content displayed in the UI  
**Fields**:
- `id`: string (unique identifier)
- `title`: string (film title, supports i18n)
- `description`: string (film description, supports i18n)
- `category`: string (film category reference)
- `duration`: number (minutes)
- `poster`: string (image URL)
- `screenings`: array of screening objects

**Validation Rules**:
- All fields required except optional screenings
- Title and description must have both TC and EN translations
- Duration must be positive integer
- Poster URL must be valid

### Screening
**Source**: Static JSON (`dist/data/screenings.json`)  
**Purpose**: Schedule information for conflict detection  
**Fields**:
- `id`: string (unique identifier)
- `filmId`: string (reference to film)
- `venueId`: string (reference to venue)
- `startTime`: string (ISO datetime)
- `endTime`: string (ISO datetime)

**Validation Rules**:
- Start time must be before end time
- Venue and film references must exist
- No overlapping screenings for same venue (enforced at data level)

### User Schedule
**Source**: LocalStorage (`userSchedule`)  
**Purpose**: User's selected screenings  
**Fields**:
- `selectedScreenings`: array of screening IDs
- `lastUpdated`: string (ISO datetime)

**Validation Rules**:
- Screening IDs must reference valid screenings
- No conflicting screenings (same time/venue)
- Maximum selections reasonable for festival duration

### User Preferences
**Source**: LocalStorage (`userPreferences`)  
**Purpose**: UI customization and settings  
**Fields**:
- `language`: string ('tc' | 'en')
- `theme`: string (if applicable)
- `notifications`: boolean

**Validation Rules**:
- Language must be 'tc' or 'en'
- Preferences preserved during UI transition

## Relationships
- Film → Screenings (one-to-many)
- Screening → Film (many-to-one)
- Screening → Venue (many-to-one)
- User Schedule → Screenings (many-to-many, stored as IDs)

## State Transitions
No new state transitions introduced. Existing conflict detection logic remains unchanged.

## Data Flow
1. Static JSON loaded on app initialization
2. User interactions update LocalStorage
3. UI reflects current state from both sources
4. No server synchronization required