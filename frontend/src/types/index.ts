/**
 * Core data type interfaces matching JSON data structure
 */

export interface Film {
  id: string;
  title_tc: string;
  title_en: string;
  category_id: string;
  synopsis_tc: string;
  synopsis_en: string;
  runtime_minutes: number;
  director: string;
  country: string;
  poster_url: string;
  detail_url_tc: string;
  detail_url_en: string;
}

export interface Category {
  id: string;
  name_tc: string;
  name_en: string;
  sort_order: number;
  description_tc: string;
  description_en: string;
}

export interface Venue {
  id: string;
  name_tc: string;
  name_en: string;
  address_tc?: string;
  address_en?: string;
}

export interface Screening {
  id: string;
  film_id: string;
  venue_id: string;
  datetime: string;
  duration_minutes: number;
  language: string;
}

export interface Selection {
  screening_id: string;
  added_at: string;
  film_snapshot: Film;
  screening_snapshot: Screening;
  venue_snapshot: Venue;
}

export interface StorageData {
  version: number;
  selections: Selection[];
  last_updated: string;
}

export interface ConflictInfo {
  severity: 'impossible' | 'warning';
  screening_ids: string[];
  overlap_minutes: number;
  message_tc: string;
  message_en: string;
}

export interface DateGroup {
  date: string;
  screenings: (Selection & { conflicts?: ConflictInfo[] })[];
}
