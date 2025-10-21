/**
 * Unit Tests for FilmCard Component (T021)
 *
 * Tests FilmCard rendering, interactions, accessibility, and i18n.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FilmCard } from '../../../src/components/FilmList/FilmCard';
import type { Film, Category, Screening, Venue } from '../../../src/types';

// Mock react-i18next
const mockUseTranslation = vi.fn();
vi.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation()
}));

// Mock Heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  HeartIcon: ({ className }: { className?: string }) => (
    <svg data-testid="heart-outline" className={className} />
  ),
  ClockIcon: ({ className }: { className?: string }) => (
    <svg data-testid="clock-icon" className={className} />
  ),
  MapPinIcon: ({ className }: { className?: string }) => (
    <svg data-testid="map-pin-icon" className={className} />
  ),
  CalendarIcon: ({ className }: { className?: string }) => (
    <svg data-testid="calendar-icon" className={className} />
  )
}));

vi.mock('@heroicons/react/24/solid', () => ({
  HeartIcon: ({ className }: { className?: string }) => (
    <svg data-testid="heart-solid" className={className} />
  )
}));

describe('FilmCard Component', () => {
  const mockCategory: Category = {
    id: 'cat1',
    name_tc: '劇情片',
    name_en: 'Drama',
    sort_order: 1,
    description_tc: '劇情片描述',
    description_en: 'Drama description'
  };

  const mockVenue: Venue = {
    id: 'venue1',
    name_tc: '會場A',
    name_en: 'Venue A',
    address_tc: '地址A',
    address_en: 'Address A'
  };

  const mockFilm: Film = {
    id: 'film1',
    title_tc: '電影標題',
    title_en: 'Film Title',
    category_id: 'cat1',
    synopsis_tc: '電影簡介',
    synopsis_en: 'Film synopsis',
    runtime_minutes: 120,
    director: '導演',
    country: '國家',
    poster_url: 'poster.jpg',
    detail_url_tc: 'detail_tc.html',
    detail_url_en: 'detail_en.html'
  };

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

  const mockOnClick = vi.fn();
  const mockOnToggleFavorite = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      t: (key: string, options?: Record<string, unknown>) => {
        // Simulate i18next behavior
        if (key === 'filmCard.director') return 'Director';
        if (key === 'filmCard.runtime') return `${options?.minutes} min`;
        if (key === 'filmCard.posterAlt') return `${options?.title} poster`;
        if (key === 'filmCard.addFavorite') return `Add ${options?.title} to favorites`;
        if (key === 'filmCard.removeFavorite') return `Remove ${options?.title} from favorites`;
        if (key === 'filmCard.screenings') return `${options?.count} screenings`;
        return key;
      },
      i18n: { language: 'en' }
    });
  });

  describe('Rendering', () => {
    it('renders film information correctly in English', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          screenings={mockScreenings}
          venues={[mockVenue]}
          venueLookup={{ [mockVenue.id]: mockVenue }}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId('film-title')).toHaveTextContent('Film Title');
      expect(screen.getByText('導演 • 2025')).toBeInTheDocument();
      expect(screen.getByText('Drama')).toBeInTheDocument();
    });

    it('renders film information correctly in Traditional Chinese', () => {
      mockUseTranslation.mockReturnValue({
        t: (key: string, options?: Record<string, unknown>) => {
          // Simulate i18next behavior for Chinese
          if (key === 'filmCard.director') return '導演';
          if (key === 'filmCard.runtime') return `${options?.minutes} 分鐘`;
          if (key === 'filmCard.posterAlt') return `${options?.title} 海報`;
          if (key === 'filmCard.addFavorite') return `將 ${options?.title} 加入收藏`;
          if (key === 'filmCard.removeFavorite') return `從收藏中移除 ${options?.title}`;
          if (key === 'filmCard.screenings') return `${options?.count} 場次`;
          return key;
        },
        i18n: { language: 'tc' }
      });

      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          screenings={mockScreenings}
          venues={[mockVenue]}
          venueLookup={{ [mockVenue.id]: mockVenue }}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId('film-title')).toHaveTextContent('電影標題');
      expect(screen.getByText('導演 • 2025')).toBeInTheDocument();
      expect(screen.getByText('劇情片')).toBeInTheDocument();
    });

    it('renders poster image with correct attributes', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
        />
      );

      const poster = screen.getByTestId('film-poster');
      expect(poster).toHaveAttribute('src', 'poster.jpg');
      expect(poster).toHaveAttribute('alt', 'Film Title poster');
      expect(poster).toHaveAttribute('loading', 'lazy');
    });

    it('renders rating badge when provided', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
          rating="PG-13"
        />
      );

      expect(screen.getByText('PG-13')).toBeInTheDocument();
    });

    it('renders screening information', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          screenings={mockScreenings}
          venues={[mockVenue]}
          venueLookup={{ [mockVenue.id]: mockVenue }}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Venue A')).toBeInTheDocument();
      expect(screen.getByText('1 screenings')).toBeInTheDocument();
      expect(screen.getByText('120 min')).toBeInTheDocument();
    });
  });

  describe('Image Loading', () => {
    it('shows loading skeleton initially', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
        />
      );

      // Initially shows skeleton div
      const skeleton = document.querySelector('.film-card__skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('handles image load successfully', async () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
        />
      );

      const poster = screen.getByTestId('film-poster');
      fireEvent.load(poster);

      await waitFor(() => {
        // Skeleton should be hidden after image loads
        const skeleton = document.querySelector('.film-card__skeleton');
        expect(skeleton).not.toBeInTheDocument();
      });
    });

    it('handles image load error', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
        />
      );

      const poster = screen.getByTestId('film-poster');
      fireEvent.error(poster);

      expect(poster).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'));
    });
  });

  describe('Interactions', () => {
    it('calls onClick when card is clicked', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByTestId('film-card');
      fireEvent.click(card);

      expect(mockOnClick).toHaveBeenCalledWith(mockFilm);
    });

    it('calls onToggleFavorite when favorite button is clicked', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByLabelText('Add Film Title to favorites');
      fireEvent.click(favoriteButton);

      expect(mockOnToggleFavorite).toHaveBeenCalled();
    });

    it('prevents event propagation when favorite button is clicked', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByLabelText('Add Film Title to favorites');
      fireEvent.click(favoriteButton);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('shows solid heart when isFavorite is true', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
          isFavorite={true}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const heartIcon = screen.getByLabelText('Remove Film Title from favorites').querySelector('svg');
      expect(heartIcon).toHaveAttribute('fill', 'currentColor');
    });

    it('shows outline heart when isFavorite is false', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const heartIcon = screen.getByLabelText('Add Film Title to favorites').querySelector('svg');
      expect(heartIcon).toHaveAttribute('fill', 'none');
    });


  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
        />
      );

      const card = screen.getByTestId('film-card');
      expect(card).toHaveAttribute('aria-label', 'Film Title, Director: 導演, 120 min');
    });

    it('has accessible favorite button', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
          onToggleFavorite={mockOnToggleFavorite}
          isFavorite={true}
        />
      );

      const favoriteButton = screen.getByLabelText('Remove Film Title from favorites');
      expect(favoriteButton).toBeInTheDocument();
    });

    it('has accessible favorite button in Chinese', () => {
      mockUseTranslation.mockReturnValue({
        t: (key: string, options?: Record<string, unknown>) => {
          // Simulate i18next behavior for Chinese
          if (key === 'filmCard.director') return '導演';
          if (key === 'filmCard.runtime') return `${options?.minutes} 分鐘`;
          if (key === 'filmCard.posterAlt') return `${options?.title} 海報`;
          if (key === 'filmCard.addFavorite') return `將 ${options?.title} 加入收藏`;
          if (key === 'filmCard.removeFavorite') return `從收藏中移除 ${options?.title}`;
          if (key === 'filmCard.screenings') return `${options?.count} 場次`;
          return key;
        },
        i18n: { language: 'tc' }
      });

      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          onClick={mockOnClick}
          onToggleFavorite={mockOnToggleFavorite}
          isFavorite={false}
        />
      );

      const favoriteButton = screen.getByLabelText('將 電影標題 加入收藏');
      expect(favoriteButton).toBeInTheDocument();
    });
  });

  describe('Venue Processing', () => {
    it('displays primary venue correctly', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          screenings={mockScreenings}
          venues={[mockVenue]}
          venueLookup={{ [mockVenue.id]: mockVenue }}
          primaryVenueId={mockVenue.id}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Venue A')).toBeInTheDocument();
    });

    it('handles multiple screenings at different venues', () => {
      const anotherVenue: Venue = {
        id: 'venue2',
        name_tc: '會場B',
        name_en: 'Venue B'
      };

      const multipleScreenings: Screening[] = [
        { ...mockScreenings[0] },
        {
          id: 'screening2',
          film_id: 'film1',
          venue_id: 'venue2',
          datetime: '2025-03-16T19:30:00',
          duration_minutes: 120,
          language: 'English'
        }
      ];

      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          screenings={multipleScreenings}
          venues={[mockVenue, anotherVenue]}
          venueLookup={{
            [mockVenue.id]: mockVenue,
            [anotherVenue.id]: anotherVenue
          }}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('2 screenings')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null category', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={null}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId('film-title')).toHaveTextContent('Film Title');
      expect(screen.queryByText('Drama')).not.toBeInTheDocument();
    });

    it('handles empty screenings array', () => {
      render(
        <FilmCard
          film={mockFilm}
          category={mockCategory}
          screenings={[]}
          onClick={mockOnClick}
        />
      );

      expect(screen.queryByText('screenings')).not.toBeInTheDocument();
      expect(screen.getByText('120 min')).toBeInTheDocument();
    });

    it('handles missing runtime', () => {
      const filmWithoutRuntime = { ...mockFilm, runtime_minutes: 0 };

      render(
        <FilmCard
          film={filmWithoutRuntime}
          category={mockCategory}
          onClick={mockOnClick}
        />
      );

      expect(screen.queryByText('min')).not.toBeInTheDocument();
    });
  });
});