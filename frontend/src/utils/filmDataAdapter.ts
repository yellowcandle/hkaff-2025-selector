/**
 * Data adapter to convert between normalized database structure
 * and denormalized Figma component structure
 */

import type { Film, Screening, Category, Venue } from '../types';

export interface FigmaFilm {
  id: string;
  title: string;
  director: string;
  country: string;
  year: number;
  runtime: number;
  genre: string[];
  synopsis: string;
  venue: string;
  screenings: Array<{ id: string; date: string; time: string; venue: string }>;
  language: string;
  subtitles: string;
  rating?: string;
  image: string;
}

/**
 * Convert normalized film data to Figma component format
 */
export function convertToFigmaFilm(
  film: Film,
  screenings: Screening[],
  venues: Venue[],
  category: Category | undefined,
  language: 'tc' | 'en'
): FigmaFilm {
  // Get all screenings for this film
  const filmScreenings = screenings.filter(s => s.film_id === film.id);

  // Get primary venue (from first screening)
  const primaryVenue = filmScreenings.length > 0
    ? venues.find(v => v.id === filmScreenings[0].venue_id)
    : undefined;

  // Extract year from detail URL or use current year
  const year = 2025; // Could be parsed from data if available

  return {
    id: film.id,
    title: language === 'tc' ? film.title_tc : film.title_en,
    director: film.director,
    country: film.country,
    year: year,
    runtime: film.runtime_minutes,
    genre: category ? [language === 'tc' ? category.name_tc : category.name_en] : [],
    synopsis: language === 'tc' ? film.synopsis_tc : film.synopsis_en,
    venue: primaryVenue
      ? (language === 'tc' ? primaryVenue.name_tc : primaryVenue.name_en)
      : '',
    screenings: filmScreenings.map(screening => {
      const venue = venues.find(v => v.id === screening.venue_id);
      const datetime = new Date(screening.datetime);
      return {
        id: screening.id,
        date: screening.datetime.split('T')[0],
        time: datetime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        venue: venue
          ? (language === 'tc' ? venue.name_tc : venue.name_en)
          : ''
      };
    }),
    language: filmScreenings[0]?.language || '',
    subtitles: 'English', // Could be from data if available
    rating: undefined, // Could be from data if available
    image: film.poster_url
  };
}

/**
 * Convert all films to Figma format
 */
export function convertAllToFigmaFilms(
  films: Film[],
  screenings: Screening[],
  venues: Venue[],
  categories: Category[],
  language: 'tc' | 'en'
): FigmaFilm[] {
  return films.map(film => {
    const category = categories.find(c => c.id === film.category_id);
    return convertToFigmaFilm(film, screenings, venues, category, language);
  });
}
