// Contract: Film Data Access
// Ensures consistent interface for accessing film data across UI components

export interface FilmDataAccess {
  getAllFilms(): Promise<Film[]>;
  getFilmById(id: string): Promise<Film | null>;
  getFilmsByCategory(categoryId: string): Promise<Film[]>;
  searchFilms(query: string): Promise<Film[]>;
}

export interface Film {
  id: string;
  title: { tc: string; en: string };
  description: { tc: string; en: string };
  category: string;
  duration: number;
  poster: string;
  screenings: Screening[];
}

export interface Screening {
  id: string;
  filmId: string;
  venueId: string;
  startTime: string;
  endTime: string;
}

// Contract Tests
// These tests must fail until implementation is complete
describe('FilmDataAccess Contract', () => {
  let dataAccess: FilmDataAccess;

  beforeEach(() => {
    // Implementation will provide concrete instance
    dataAccess = {} as FilmDataAccess;
  });

  it('should return all films', async () => {
    const films = await dataAccess.getAllFilms();
    expect(Array.isArray(films)).toBe(true);
    expect(films.length).toBeGreaterThan(0);
  });

  it('should return film by id', async () => {
    const film = await dataAccess.getFilmById('test-id');
    expect(film).toBeDefined();
  });

  it('should return films by category', async () => {
    const films = await dataAccess.getFilmsByCategory('test-category');
    expect(Array.isArray(films)).toBe(true);
  });

  it('should search films', async () => {
    const films = await dataAccess.searchFilms('test query');
    expect(Array.isArray(films)).toBe(true);
  });
});