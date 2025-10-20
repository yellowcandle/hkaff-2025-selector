/**
 * FilmService - Provides FilmDataAccess functionality for UI components
 *
 * Integrates with existing DataLoader service to provide film data access
 * Implements FilmDataAccess interface for UI component integration
 */

import type { Film, Screening, Venue, Category } from '../../../specs/001-given-this-film/contracts/service-interfaces';
import { dataLoader } from './dataLoader';

export interface FilmDataAccess {
  /**
   * Get all films
   */
  getFilms(): Promise<Film[]>;

  /**
   * Get film by ID
   */
  getFilmById(id: string): Promise<Film | null>;

  /**
   * Get screenings for a specific film
   */
  getScreeningsForFilm(filmId: string): Promise<Screening[]>;

  /**
   * Get all screenings
   */
  getScreenings(): Promise<Screening[]>;

  /**
   * Get all venues
   */
  getVenues(): Promise<Venue[]>;

  /**
   * Get venue by ID
   */
  getVenueById(id: string): Promise<Venue | null>;

  /**
   * Get all categories
   */
  getCategories(): Promise<Category[]>;

  /**
   * Get category by ID
   */
  getCategoryById(id: string): Promise<Category | null>;

  /**
   * Load all data at once
   */
  loadAllData(): Promise<{
    films: Film[];
    screenings: Screening[];
    venues: Venue[];
    categories: Category[];
  }>;
}

/**
 * FilmService implementation
 */
class FilmService implements FilmDataAccess {
  private films: Film[] | null = null;
  private screenings: Screening[] | null = null;
  private venues: Venue[] | null = null;
  private categories: Category[] | null = null;

  /**
   * Ensure data is loaded
   */
  private async ensureDataLoaded(): Promise<void> {
    if (!this.films || !this.screenings || !this.venues || !this.categories) {
      const data = await dataLoader.loadAll();
      this.films = data.films;
      this.screenings = data.screenings;
      this.venues = data.venues;
      this.categories = data.categories;
    }
  }

  /**
   * Get all films
   */
  async getFilms(): Promise<Film[]> {
    await this.ensureDataLoaded();
    return this.films!;
  }

  /**
   * Get film by ID
   */
  async getFilmById(id: string): Promise<Film | null> {
    await this.ensureDataLoaded();
    return this.films!.find(film => film.id === id) || null;
  }

  /**
   * Get screenings for a specific film
   */
  async getScreeningsForFilm(filmId: string): Promise<Screening[]> {
    await this.ensureDataLoaded();
    return this.screenings!.filter(screening => screening.film_id === filmId);
  }

  /**
   * Get all screenings
   */
  async getScreenings(): Promise<Screening[]> {
    await this.ensureDataLoaded();
    return this.screenings!;
  }

  /**
   * Get all venues
   */
  async getVenues(): Promise<Venue[]> {
    await this.ensureDataLoaded();
    return this.venues!;
  }

  /**
   * Get venue by ID
   */
  async getVenueById(id: string): Promise<Venue | null> {
    await this.ensureDataLoaded();
    return this.venues!.find(venue => venue.id === id) || null;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    await this.ensureDataLoaded();
    return this.categories!;
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    await this.ensureDataLoaded();
    return this.categories!.find(category => category.id === id) || null;
  }

  /**
   * Load all data at once
   */
  async loadAllData(): Promise<{
    films: Film[];
    screenings: Screening[];
    venues: Venue[];
    categories: Category[];
  }> {
    await this.ensureDataLoaded();
    return {
      films: this.films!,
      screenings: this.screenings!,
      venues: this.venues!,
      categories: this.categories!
    };
  }
}

// Export singleton instance
export const filmService = new FilmService();
export { FilmService };
export default filmService;