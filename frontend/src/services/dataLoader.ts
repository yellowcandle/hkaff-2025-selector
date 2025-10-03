/**
 * DataLoader Service - Loads static festival data from JSON files
 *
 * Implements IDataLoader interface from service-interfaces.ts
 * Loads films, screenings, venues, and categories from /data/*.json files
 */

import type { Film, Screening, Venue, Category, IDataLoader } from '../../../specs/001-given-this-film/contracts/service-interfaces';

const DATA_BASE_PATH = '/data';

/**
 * Fetch and parse JSON data from a file
 * @param filename Name of the JSON file to load
 * @returns Parsed JSON data
 * @throws Error if file not found or invalid JSON
 */
async function fetchJSON<T>(filename: string): Promise<T> {
  const url = `${DATA_BASE_PATH}/${filename}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading ${filename}: ${error.message}`);
    }
    throw new Error(`Unknown error loading ${filename}`);
  }
}

/**
 * DataLoader implementation
 */
class DataLoader implements IDataLoader {
  /**
   * Load all films from films.json
   * @throws Error if file not found or invalid JSON
   */
  async loadFilms(): Promise<Film[]> {
    // Load main films.json and also try to load optional HKAFF-specific films
    const films = await fetchJSON<Film[]>('films.json');

    try {
      const hkaffFilms = await fetchJSON<Film[]>('hkaff-films.json');

      // Merge without duplicating IDs from the main films list
      const existingIds = new Set(films.map(f => f.id));
      const merged = films.concat(hkaffFilms.filter(f => !existingIds.has(f.id)));
      return merged;
    } catch (err) {
      // If the optional file is missing or fails to load, return the base films list
      console.warn('Optional hkaff-films.json not found or failed to load:', err);
      return films;
    }
  }

  /**
   * Load all screenings from screenings.json
   * @throws Error if file not found or invalid JSON
   */
  async loadScreenings(): Promise<Screening[]> {
    return fetchJSON<Screening[]>('screenings.json');
  }

  /**
   * Load all venues from venues.json
   * @throws Error if file not found or invalid JSON
   */
  async loadVenues(): Promise<Venue[]> {
    return fetchJSON<Venue[]>('venues.json');
  }

  /**
   * Load all categories from categories.json
   * @throws Error if file not found or invalid JSON
   */
  async loadCategories(): Promise<Category[]> {
    return fetchJSON<Category[]>('categories.json');
  }

  /**
   * Load all data files in parallel
   * @returns Object with all loaded data
   */
  async loadAll(): Promise<{
    films: Film[];
    screenings: Screening[];
    venues: Venue[];
    categories: Category[];
  }> {
    const [films, screenings, venues, categories] = await Promise.all([
      this.loadFilms(),
      this.loadScreenings(),
      this.loadVenues(),
      this.loadCategories()
    ]);

    return { films, screenings, venues, categories };
  }
}

// Export both class and singleton instance
export { DataLoader };
export const dataLoader = new DataLoader();
export default dataLoader;
