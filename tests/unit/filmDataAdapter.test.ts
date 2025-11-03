import { describe, it, expect } from 'vitest';
import { convertToFigmaFilm, convertAllToFigmaFilms, type FigmaFilm } from '../../frontend/src/utils/filmDataAdapter';
import type { Film, Screening, Category, Venue } from '../../frontend/src/types';

describe('Film Data Adapter', () => {
  const mockVenue: Venue = {
    id: 'venue-1',
    name_tc: '香港文化中心',
    name_en: 'Hong Kong Cultural Centre',
    address_tc: '尖沙咀',
    address_en: 'Tsim Sha Tsui'
  };

  const mockCategory: Category = {
    id: 'cat-1',
    name_tc: '劇情片',
    name_en: 'Drama',
    sort_order: 1,
    description_tc: '劇情片描述',
    description_en: 'Drama films'
  };

  const mockFilm: Film = {
    id: 'film-376',
    title_tc: '新世界',
    title_en: 'Another World',
    director: 'Wong Kar-wai',
    country: 'Hong Kong',
    runtime_minutes: 105,
    synopsis_tc: '一部關於香港的故事',
    synopsis_en: 'A film about Hong Kong',
    poster_url: 'https://example.com/poster.jpg',
    category_id: 'cat-1',
    detail_url_tc: 'https://example.com/film/376-tc',
    detail_url_en: 'https://example.com/film/376-en'
  };

  const mockScreening: Screening = {
    id: 'screening-1',
    film_id: 'film-376',
    venue_id: 'venue-1',
    datetime: '2025-03-15T19:30:00',
    duration_minutes: 105,
    language: 'Cantonese'
  };

  describe('convertToFigmaFilm', () => {
    it('should convert film to FigmaFilm format in Traditional Chinese', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening],
        [mockVenue],
        mockCategory,
        'tc'
      );

      expect(result).toMatchObject({
        id: 'film-376',
        title: '新世界',
        director: 'Wong Kar-wai',
        country: 'Hong Kong',
        runtime: 105,
        genre: ['劇情片'],
        synopsis: '一部關於香港的故事',
        venue: '香港文化中心',
        language: 'Cantonese',
        image: 'https://example.com/poster.jpg'
      });
    });

    it('should convert film to FigmaFilm format in English', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening],
        [mockVenue],
        mockCategory,
        'en'
      );

      expect(result).toMatchObject({
        id: 'film-376',
        title: 'Another World',
        director: 'Wong Kar-wai',
        country: 'Hong Kong',
        runtime: 105,
        genre: ['Drama'],
        synopsis: 'A film about Hong Kong',
        venue: 'Hong Kong Cultural Centre',
        language: 'Cantonese',
        image: 'https://example.com/poster.jpg'
      });
    });

    it('should include screenings with date and time', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening],
        [mockVenue],
        mockCategory,
        'en'
      );

      expect(result.screenings).toHaveLength(1);
      expect(result.screenings[0]).toMatchObject({
        id: 'screening-1',
        date: '2025-03-15',
        time: '19:30',
        venue: 'Hong Kong Cultural Centre'
      });
    });

    it('should handle multiple screenings for a film', () => {
      const screening2: Screening = {
        ...mockScreening,
        id: 'screening-2',
        datetime: '2025-03-16T14:00:00'
      };

      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening, screening2],
        [mockVenue],
        mockCategory,
        'en'
      );

      expect(result.screenings).toHaveLength(2);
      expect(result.screenings[0].date).toBe('2025-03-15');
      expect(result.screenings[1].date).toBe('2025-03-16');
    });

    it('should handle missing category gracefully', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening],
        [mockVenue],
        undefined,
        'en'
      );

      expect(result.genre).toEqual([]);
    });

    it('should handle multiple venues across screenings', () => {
      const venue2: Venue = {
        id: 'venue-2',
        name_tc: '香港藝術中心',
        name_en: 'Hong Kong Arts Centre',
        address_tc: '灣仔',
        address_en: 'Wan Chai'
      };

      const screening2: Screening = {
        ...mockScreening,
        id: 'screening-2',
        venue_id: 'venue-2',
        datetime: '2025-03-16T14:00:00'
      };

      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening, screening2],
        [mockVenue, venue2],
        mockCategory,
        'en'
      );

      expect(result.screenings).toHaveLength(2);
      expect(result.screenings[0].venue).toBe('Hong Kong Cultural Centre');
      expect(result.screenings[1].venue).toBe('Hong Kong Arts Centre');
    });

    it('should use primary venue from first screening', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening],
        [mockVenue],
        mockCategory,
        'en'
      );

      expect(result.venue).toBe('Hong Kong Cultural Centre');
    });

    it('should set year to 2025', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening],
        [mockVenue],
        mockCategory,
        'en'
      );

      expect(result.year).toBe(2025);
    });
  });

  describe('convertAllToFigmaFilms', () => {
    it('should convert multiple films to FigmaFilm format', () => {
      const film2: Film = {
        ...mockFilm,
        id: 'film-377',
        title_tc: '通往威尼達的路',
        title_en: 'Road to Vendetta',
        director: 'David Cinematic'
      };

      const screening2: Screening = {
        ...mockScreening,
        id: 'screening-2',
        film_id: 'film-377',
        datetime: '2025-03-16T20:00:00'
      };

      const results = convertAllToFigmaFilms(
        [mockFilm, film2],
        [mockScreening, screening2],
        [mockVenue],
        [mockCategory],
        'en'
      );

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('film-376');
      expect(results[1].id).toBe('film-377');
    });

    it('should preserve language preference across all films', () => {
      const results = convertAllToFigmaFilms(
        [mockFilm],
        [mockScreening],
        [mockVenue],
        [mockCategory],
        'tc'
      );

      expect(results[0].title).toBe('新世界');
      expect(results[0].synopsis).toBe('一部關於香港的故事');
    });

    it('should match films with their categories', () => {
      const category2: Category = {
        id: 'cat-2',
        name_tc: '紀錄片',
        name_en: 'Documentary',
        sort_order: 2,
        description_tc: '紀錄片描述',
        description_en: 'Documentary films'
      };

      const film2: Film = {
        ...mockFilm,
        id: 'film-377',
        category_id: 'cat-2'
      };

      const results = convertAllToFigmaFilms(
        [mockFilm, film2],
        [mockScreening],
        [mockVenue],
        [mockCategory, category2],
        'en'
      );

      expect(results[0].genre).toEqual(['Drama']);
      expect(results[1].genre).toEqual(['Documentary']);
    });

    it('should handle empty film array', () => {
      const results = convertAllToFigmaFilms(
        [],
        [],
        [mockVenue],
        [mockCategory],
        'en'
      );

      expect(results).toEqual([]);
    });
  });

  describe('FigmaFilm type validation', () => {
    it('should have all required FigmaFilm properties', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening],
        [mockVenue],
        mockCategory,
        'en'
      );

      const requiredProps = ['id', 'title', 'director', 'country', 'year', 'runtime', 'genre', 'synopsis', 'venue', 'screenings', 'language', 'subtitles', 'image'];
      
      requiredProps.forEach(prop => {
        expect(result).toHaveProperty(prop);
      });
    });

    it('should have correct property types', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening],
        [mockVenue],
        mockCategory,
        'en'
      );

      expect(typeof result.id).toBe('string');
      expect(typeof result.title).toBe('string');
      expect(typeof result.director).toBe('string');
      expect(typeof result.country).toBe('string');
      expect(typeof result.year).toBe('number');
      expect(typeof result.runtime).toBe('number');
      expect(Array.isArray(result.genre)).toBe(true);
      expect(typeof result.synopsis).toBe('string');
      expect(typeof result.venue).toBe('string');
      expect(Array.isArray(result.screenings)).toBe(true);
      expect(typeof result.language).toBe('string');
      expect(typeof result.subtitles).toBe('string');
      expect(typeof result.image).toBe('string');
    });
  });

  describe('Edge cases', () => {
    it('should handle film with no screenings', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [],
        [mockVenue],
        mockCategory,
        'en'
      );

      expect(result.screenings).toEqual([]);
      expect(result.venue).toBe('');
    });

    it('should handle screening with missing venue', () => {
      const result = convertToFigmaFilm(
        mockFilm,
        [mockScreening],
        [],
        mockCategory,
        'en'
      );

      expect(result.screenings[0].venue).toBe('');
    });

    it('should format time correctly for midnight screening', () => {
      const midnightScreening: Screening = {
        ...mockScreening,
        datetime: '2025-03-15T00:00:00'
      };

      const result = convertToFigmaFilm(
        mockFilm,
        [midnightScreening],
        [mockVenue],
        mockCategory,
        'en'
      );

      expect(result.screenings[0].time).toBe('00:00');
    });

    it('should format time correctly for afternoon screening', () => {
      const afternoonScreening: Screening = {
        ...mockScreening,
        datetime: '2025-03-15T14:30:00'
      };

      const result = convertToFigmaFilm(
        mockFilm,
        [afternoonScreening],
        [mockVenue],
        mockCategory,
        'en'
      );

      expect(result.screenings[0].time).toBe('14:30');
    });
  });
});
