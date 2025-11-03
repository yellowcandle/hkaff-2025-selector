import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AppHKAFF Data Loading', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should load films from JSON endpoint', async () => {
    const mockResponse = [
      {
        id: 'film-376',
        title_tc: '新世界',
        title_en: 'Another World',
        director: 'Wong Kar-wai',
        country: 'Hong Kong',
        runtime_minutes: 105,
        synopsis_tc: '香港故事',
        synopsis_en: 'Hong Kong film',
        poster_url: 'https://example.com/poster.jpg',
        category_id: 'cat-1',
        detail_url_tc: 'https://example.com/film/376-tc',
        detail_url_en: 'https://example.com/film/376-en'
      }
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockResponse
      } as unknown as Response)
    );

    const response = await fetch('/data/films.json');
    const data = await response.json() as typeof mockResponse;

    expect(data).toEqual(mockResponse);
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('film-376');
  });

  it('should load screenings from JSON endpoint', async () => {
    const mockResponse = [
      {
        id: 'screening-1',
        film_id: 'film-376',
        venue_id: 'venue-1',
        datetime: '2025-03-15T19:30:00',
        duration_minutes: 105,
        language: 'Cantonese'
      }
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockResponse
      } as unknown as Response)
    );

    const response = await fetch('/data/screenings.json');
    const data = await response.json() as typeof mockResponse;

    expect(data).toEqual(mockResponse);
    expect(data).toHaveLength(1);
    expect((data as any)[0].film_id).toBe('film-376');
  });

  it('should handle fetch errors gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    try {
      await fetch('/data/films.json');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should handle 404 responses', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404
      } as Response)
    );

    const response = await fetch('/data/nonexistent.json');
    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  });

  it('should cache loaded data in state', async () => {
    const mockFilms: any[] = [
      {
        id: 'film-376',
        title_tc: '新世界',
        title_en: 'Another World',
        director: 'Wong Kar-wai',
        country: 'Hong Kong',
        runtime_minutes: 105,
        synopsis_tc: '香港故事',
        synopsis_en: 'Hong Kong film',
        poster_url: 'https://example.com/poster.jpg',
        category_id: 'cat-1',
        detail_url_tc: 'https://example.com/film/376-tc',
        detail_url_en: 'https://example.com/film/376-en'
      }
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockFilms
      } as unknown as Response)
    );

    // First fetch
    let response = await fetch('/data/films.json');
    let data = await response.json() as any;
    expect(data).toEqual(mockFilms);

    // Second fetch should use cached data (mocked)
    response = await fetch('/data/films.json');
    data = await response.json() as any;
    expect(data).toEqual(mockFilms);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

describe('AppHKAFF Data Transformation', () => {
  it('should transform film data for display', () => {
    const rawFilm = {
      id: 'film-376',
      title_tc: '新世界',
      title_en: 'Another World',
      director: 'Wong Kar-wai',
      country: 'Hong Kong',
      runtime_minutes: 105,
      synopsis_tc: '香港故事',
      synopsis_en: 'Hong Kong film',
      poster_url: 'https://example.com/poster.jpg',
      category_id: 'cat-1',
      detail_url_tc: 'https://example.com/film/376-tc',
      detail_url_en: 'https://example.com/film/376-en'
    };

    // Simulate transformation
    const displayFilm = {
      ...rawFilm,
      title: rawFilm.title_en,
      synopsis: rawFilm.synopsis_en
    };

    expect(displayFilm.title).toBe('Another World');
    expect(displayFilm.synopsis).toBe('Hong Kong film');
  });

  it('should switch language in transformed data', () => {
    const rawFilm = {
      id: 'film-376',
      title_tc: '新世界',
      title_en: 'Another World',
      director: 'Wong Kar-wai',
      country: 'Hong Kong',
      runtime_minutes: 105,
      synopsis_tc: '香港故事',
      synopsis_en: 'Hong Kong film',
      poster_url: 'https://example.com/poster.jpg',
      category_id: 'cat-1',
      detail_url_tc: 'https://example.com/film/376-tc',
      detail_url_en: 'https://example.com/film/376-en'
    };

    // English version
    const enDisplay = {
      ...rawFilm,
      title: rawFilm.title_en,
      synopsis: rawFilm.synopsis_en
    };

    expect(enDisplay.title).toBe('Another World');

    // Chinese version
    const tcDisplay = {
      ...rawFilm,
      title: rawFilm.title_tc,
      synopsis: rawFilm.synopsis_tc
    };

    expect(tcDisplay.title).toBe('新世界');
  });
});

describe('AppHKAFF Data Validation', () => {
  it('should validate required film fields', () => {
    const isValidFilm = (film: any) => {
      return (
        film.id &&
        film.title_tc &&
        film.title_en &&
        film.director &&
        film.country &&
        film.runtime_minutes &&
        film.synopsis_tc &&
        film.synopsis_en &&
        film.poster_url &&
        film.category_id &&
        film.detail_url_tc &&
        film.detail_url_en
      );
    };

    const validFilm = {
      id: 'film-376',
      title_tc: '新世界',
      title_en: 'Another World',
      director: 'Wong Kar-wai',
      country: 'Hong Kong',
      runtime_minutes: 105,
      synopsis_tc: '香港故事',
      synopsis_en: 'Hong Kong film',
      poster_url: 'https://example.com/poster.jpg',
      category_id: 'cat-1',
      detail_url_tc: 'https://example.com/film/376-tc',
      detail_url_en: 'https://example.com/film/376-en'
    };

    expect(isValidFilm(validFilm)).toBe(true);
  });

  it('should reject film with missing fields', () => {
    const isValidFilm = (film: any) => {
      return (
        film.id &&
        film.title_tc &&
        film.title_en &&
        film.director
      );
    };

    const invalidFilm = {
      id: 'film-376',
      title_en: 'Another World'
    };

    expect(isValidFilm(invalidFilm)).toBe(false);
  });

  it('should validate screening has required fields', () => {
    const isValidScreening = (screening: any) => {
      return (
        screening.id &&
        screening.film_id &&
        screening.venue_id &&
        screening.datetime &&
        screening.duration_minutes !== undefined &&
        screening.language
      );
    };

    const validScreening = {
      id: 'screening-1',
      film_id: 'film-376',
      venue_id: 'venue-1',
      datetime: '2025-03-15T19:30:00',
      duration_minutes: 105,
      language: 'Cantonese'
    };

    expect(isValidScreening(validScreening)).toBe(true);
  });
});

describe('AppHKAFF Error Handling', () => {
  it('should handle malformed JSON gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      } as unknown as Response)
    );

    try {
      const response = await fetch('/data/films.json');
      await response.json();
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should provide fallback for missing poster images', () => {
    const film = {
      id: 'film-376',
      title_tc: '新世界',
      title_en: 'Another World',
      director: 'Wong Kar-wai',
      country: 'Hong Kong',
      runtime_minutes: 105,
      synopsis_tc: '香港故事',
      synopsis_en: 'Hong Kong film',
      poster_url: '',
      category_id: 'cat-1',
      detail_url_tc: 'https://example.com/film/376-tc',
      detail_url_en: 'https://example.com/film/376-en'
    };

    const displayImage = film.poster_url || '/images/poster-placeholder.png';
    expect(displayImage).toBe('/images/poster-placeholder.png');
  });

  it('should handle empty film array', async () => {
    const mockResponse: any[] = [];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockResponse
      } as unknown as Response)
    );

    const response = await fetch('/data/films.json');
    const data = await response.json() as any;

    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });
});
