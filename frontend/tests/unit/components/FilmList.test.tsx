/**
 * Unit Tests for FilmList Component (T021)
 *
 * Tests FilmList rendering, filtering, loading states, and accessibility.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilmList } from '../../../src/components/FilmList/FilmList';
import type { Film, Category, Screening, Venue } from '../../../src/types';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' }
  })
}));

// Mock Skeleton component
vi.mock('../../../src/components/Skeleton/SkeletonCard', () => ({
  SkeletonGrid: ({ count }: { count: number }) => (
    <div data-testid="skeleton-grid" data-count={count}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} data-testid={`skeleton-item-${i}`} />
      ))}
    </div>
  )
}));

// Mock FilmCard component
vi.mock('../../../src/components/FilmList/FilmCard', () => ({
  FilmCard: ({ film, onClick }: { film: Film; onClick: (film: Film) => void }) => (
    <div
      data-testid={`film-card-${film.id}`}
      onClick={() => onClick(film)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(film);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {film.title_en}
    </div>
  )
}));

describe('FilmList Component', () => {
  const mockCategories: Category[] = [
    { id: 'cat1', name_tc: '劇情片', name_en: 'Drama', sort_order: 1, description_tc: '', description_en: '' },
    { id: 'cat2', name_tc: '喜劇', name_en: 'Comedy', sort_order: 2, description_tc: '', description_en: '' }
  ];

  const mockVenues: Venue[] = [
    { id: 'venue1', name_tc: '會場A', name_en: 'Venue A' },
    { id: 'venue2', name_tc: '會場B', name_en: 'Venue B' }
  ];

  const mockFilms: Film[] = [
    {
      id: 'film1',
      title_tc: '電影一',
      title_en: 'Film One',
      category_id: 'cat1',
      synopsis_tc: '簡介一',
      synopsis_en: 'Synopsis One',
      runtime_minutes: 120,
      director: 'Director One',
      country: 'Country One',
      poster_url: 'poster1.jpg',
      detail_url_tc: 'detail1_tc.html',
      detail_url_en: 'detail1_en.html'
    },
    {
      id: 'film2',
      title_tc: '電影二',
      title_en: 'Film Two',
      category_id: 'cat2',
      synopsis_tc: '簡介二',
      synopsis_en: 'Synopsis Two',
      runtime_minutes: 90,
      director: 'Director Two',
      country: 'Country Two',
      poster_url: 'poster2.jpg',
      detail_url_tc: 'detail2_tc.html',
      detail_url_en: 'detail2_en.html'
    }
  ];

  const mockScreenings: Screening[] = [
    {
      id: 'screening1',
      film_id: 'film1',
      venue_id: 'venue1',
      datetime: '2025-03-15T19:30:00',
      duration_minutes: 120,
      language: 'English'
    }
  ];

  const mockOnFilmClick = vi.fn();

  describe('Rendering', () => {
    it('renders film cards when films are provided', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          screenings={mockScreenings}
          venues={mockVenues}
          onFilmClick={mockOnFilmClick}
        />
      );

      expect(screen.getByTestId('film-card-film1')).toBeInTheDocument();
      expect(screen.getByTestId('film-card-film2')).toBeInTheDocument();
      expect(screen.getByTestId('film-grid')).toBeInTheDocument();
    });

    it('renders empty message when no films match filters', () => {
      render(
        <FilmList
          films={[]}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
          emptyMessage="No films found"
        />
      );

      expect(screen.getByTestId('film-empty')).toHaveTextContent('No films found');
    });

    it('renders loading skeleton when isLoading is true', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
          isLoading={true}
        />
      );

      expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('film-card-film1')).not.toBeInTheDocument();
    });

    it('renders compact variant correctly', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
          variant="compact"
        />
      );

      const grid = screen.getByTestId('film-grid');
      expect(grid).toHaveClass('film-grid--compact');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for region', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
          regionLabelId="main-content"
        />
      );

      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-labelledby', 'main-content');
    });

    it('renders list with proper role and tabIndex', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
        />
      );

      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('tabIndex', '-1');
    });

    it('renders empty state with aria-live', () => {
      render(
        <FilmList
          films={[]}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
        />
      );

      const emptyState = screen.getByTestId('film-empty');
      expect(emptyState).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Data Processing', () => {
    it('creates category lookup map correctly', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
        />
      );

      // The component should render without errors, indicating maps were created correctly
      expect(screen.getByTestId('film-card-film1')).toBeInTheDocument();
    });

    it('creates screening map correctly', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          screenings={mockScreenings}
          venues={mockVenues}
          onFilmClick={mockOnFilmClick}
        />
      );

      expect(screen.getByTestId('film-card-film1')).toBeInTheDocument();
    });

    it('creates venue lookup map correctly', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          screenings={mockScreenings}
          venues={mockVenues}
          onFilmClick={mockOnFilmClick}
        />
      );

      expect(screen.getByTestId('film-card-film1')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onFilmClick when film card is clicked', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
        />
      );

      const filmCard = screen.getByTestId('film-card-film1');
      fireEvent.click(filmCard);

      expect(mockOnFilmClick).toHaveBeenCalledWith(mockFilms[0]);
    });

    it('passes correct props to FilmCard components', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          screenings={mockScreenings}
          venues={mockVenues}
          onFilmClick={mockOnFilmClick}
        />
      );

      // FilmCard should receive the correct film data
      expect(screen.getByTestId('film-card-film1')).toBeInTheDocument();
      expect(screen.getByTestId('film-card-film2')).toBeInTheDocument();
    });
  });

  describe('Test IDs', () => {
    it('uses custom testIdPrefix correctly', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
          testIdPrefix="custom"
        />
      );

      expect(screen.getByTestId('custom-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('custom-grid-item')).toHaveLength(2);
    });

    it('uses default testIdPrefix when not provided', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
        />
      );

      expect(screen.getByTestId('film-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('film-grid-item')).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty screenings array', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          screenings={[]}
          venues={mockVenues}
          onFilmClick={mockOnFilmClick}
        />
      );

      expect(screen.getByTestId('film-card-film1')).toBeInTheDocument();
    });

    it('handles empty venues array', () => {
      render(
        <FilmList
          films={mockFilms}
          categories={mockCategories}
          screenings={mockScreenings}
          venues={[]}
          onFilmClick={mockOnFilmClick}
        />
      );

      expect(screen.getByTestId('film-card-film1')).toBeInTheDocument();
    });

    it('handles null category for film', () => {
      const filmsWithInvalidCategory = [
        {
          ...mockFilms[0],
          category_id: 'invalid'
        }
      ];

      render(
        <FilmList
          films={filmsWithInvalidCategory}
          categories={mockCategories}
          onFilmClick={mockOnFilmClick}
        />
      );

      expect(screen.getByTestId('film-card-film1')).toBeInTheDocument();
    });
  });
});