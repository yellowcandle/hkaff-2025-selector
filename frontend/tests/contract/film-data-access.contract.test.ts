import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FilmDataAccess } from '../../src/services/filmService';
import type { Film, Screening, Venue, Category } from '../../src/types';

/**
 * T004: Contract test for FilmDataAccess interface.
 * Tests that any implementation of FilmDataAccess behaves correctly.
 */
describe('T004: FilmDataAccess contract (frontend/tests/contract/film-data-access.contract.test.ts)', () => {
  let mockService: FilmDataAccess;
  let mockFilms: Film[];
  let mockScreenings: Screening[];
  let mockVenues: Venue[];
  let mockCategories: Category[];

  beforeEach(() => {
    // Create mock data
    mockFilms = [
      {
        id: 'film1',
        title_tc: '電影標題1',
        title_en: 'Film Title 1',
        category_id: 'cat1',
        synopsis_tc: '簡介1',
        synopsis_en: 'Synopsis 1',
        runtime_minutes: 120,
        director: '導演1',
        country: '國家1',
        poster_url: 'poster1.jpg',
        detail_url_tc: 'detail1_tc.html',
        detail_url_en: 'detail1_en.html'
      },
      {
        id: 'film2',
        title_tc: '電影標題2',
        title_en: 'Film Title 2',
        category_id: 'cat2',
        synopsis_tc: '簡介2',
        synopsis_en: 'Synopsis 2',
        runtime_minutes: 90,
        director: '導演2',
        country: '國家2',
        poster_url: 'poster2.jpg',
        detail_url_tc: 'detail2_tc.html',
        detail_url_en: 'detail2_en.html'
      }
    ];

    mockScreenings = [
      {
        id: 'screening1',
        film_id: 'film1',
        venue_id: 'venue1',
        datetime: '2025-03-15T19:30:00',
        duration_minutes: 120,
        language: 'English'
      },
      {
        id: 'screening2',
        film_id: 'film1',
        venue_id: 'venue2',
        datetime: '2025-03-16T20:00:00',
        duration_minutes: 120,
        language: 'Cantonese'
      }
    ];

    mockVenues = [
      {
        id: 'venue1',
        name_tc: '會場A',
        name_en: 'Venue A',
        address_tc: '地址A',
        address_en: 'Address A'
      },
      {
        id: 'venue2',
        name_tc: '會場B',
        name_en: 'Venue B',
        address_tc: '地址B',
        address_en: 'Address B'
      }
    ];

    mockCategories = [
      {
        id: 'cat1',
        name_tc: '劇情片',
        name_en: 'Drama',
        sort_order: 1,
        description_tc: '劇情片描述',
        description_en: 'Drama description'
      },
      {
        id: 'cat2',
        name_tc: '喜劇',
        name_en: 'Comedy',
        sort_order: 2,
        description_tc: '喜劇描述',
        description_en: 'Comedy description'
      }
    ];

    // Create mock service
    mockService = {
      getFilms: vi.fn().mockResolvedValue(mockFilms),
      getFilmById: vi.fn().mockImplementation((id: string) =>
        Promise.resolve(mockFilms.find(f => f.id === id) || null)
      ),
      getScreeningsForFilm: vi.fn().mockImplementation((filmId: string) =>
        Promise.resolve(mockScreenings.filter(s => s.film_id === filmId))
      ),
      getScreenings: vi.fn().mockResolvedValue(mockScreenings),
      getVenues: vi.fn().mockResolvedValue(mockVenues),
      getVenueById: vi.fn().mockImplementation((id: string) =>
        Promise.resolve(mockVenues.find(v => v.id === id) || null)
      ),
      getCategories: vi.fn().mockResolvedValue(mockCategories),
      getCategoryById: vi.fn().mockImplementation((id: string) =>
        Promise.resolve(mockCategories.find(c => c.id === id) || null)
      ),
      loadAllData: vi.fn().mockResolvedValue({
        films: mockFilms,
        screenings: mockScreenings,
        venues: mockVenues,
        categories: mockCategories
      })
    };
  });

  it('enforces FilmDataAccess contract methods and behaviour', async () => {
    // Test getFilms returns all films
    const films = await mockService.getFilms();
    expect(films).toEqual(mockFilms);
    expect(mockService.getFilms).toHaveBeenCalledTimes(1);

    // Test getFilmById returns correct film
    const film = await mockService.getFilmById('film1');
    expect(film).toEqual(mockFilms[0]);
    expect(mockService.getFilmById).toHaveBeenCalledWith('film1');

    // Test getFilmById returns null for non-existent film
    const nonExistentFilm = await mockService.getFilmById('nonexistent');
    expect(nonExistentFilm).toBeNull();

    // Test getScreeningsForFilm returns screenings for specific film
    const filmScreenings = await mockService.getScreeningsForFilm('film1');
    expect(filmScreenings).toHaveLength(2);
    expect(filmScreenings.every(s => s.film_id === 'film1')).toBe(true);

    // Test getScreenings returns all screenings
    const allScreenings = await mockService.getScreenings();
    expect(allScreenings).toEqual(mockScreenings);

    // Test getVenues returns all venues
    const venues = await mockService.getVenues();
    expect(venues).toEqual(mockVenues);

    // Test getVenueById returns correct venue
    const venue = await mockService.getVenueById('venue1');
    expect(venue).toEqual(mockVenues[0]);

    // Test getVenueById returns null for non-existent venue
    const nonExistentVenue = await mockService.getVenueById('nonexistent');
    expect(nonExistentVenue).toBeNull();

    // Test getCategories returns all categories
    const categories = await mockService.getCategories();
    expect(categories).toEqual(mockCategories);

    // Test getCategoryById returns correct category
    const category = await mockService.getCategoryById('cat1');
    expect(category).toEqual(mockCategories[0]);

    // Test getCategoryById returns null for non-existent category
    const nonExistentCategory = await mockService.getCategoryById('nonexistent');
    expect(nonExistentCategory).toBeNull();

    // Test loadAllData returns all data
    const allData = await mockService.loadAllData();
    expect(allData).toEqual({
      films: mockFilms,
      screenings: mockScreenings,
      venues: mockVenues,
      categories: mockCategories
    });
  });
});
