// Data Types Contract
// Defines the shape of data entities used throughout the application
// These interfaces must match the JSON schema validation in tests/contract/

export interface Film {
  id: string;
  title: {
    tc: string;
    en: string;
  };
  description: {
    tc: string;
    en: string;
  };
  category: string;
  duration: number;
  poster: string;
  screenings?: Screening[];
}

export interface Screening {
  id: string;
  filmId: string;
  venueId: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  price?: number;
}

export interface Venue {
  id: string;
  name: {
    tc: string;
    en: string;
  };
  address: {
    tc: string;
    en: string;
  };
  capacity: number;
}

export interface Category {
  id: string;
  name: {
    tc: string;
    en: string;
  };
  description?: {
    tc: string;
    en: string;
  };
}

export interface UserSchedule {
  selectedScreenings: string[]; // screening IDs
  lastUpdated: string; // ISO datetime
}

export interface UserPreferences {
  language: 'tc' | 'en';
  theme?: 'light' | 'dark';
  notifications?: boolean;
}

// Contract: All data types must support i18n structure for TC/EN
// Contract: Date/time fields use ISO string format
// Contract: IDs are strings for consistency
// Contract: Optional fields marked with ? must handle undefined gracefully