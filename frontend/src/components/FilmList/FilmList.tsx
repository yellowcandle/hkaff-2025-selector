import React, { useMemo } from 'react';
import './FilmList.css';

import type { Film, Category, Screening, Venue } from '../../types';
import { FilmCard } from './FilmCard';
import { SkeletonGrid } from '../Skeleton/SkeletonCard';

type FilmListVariant = 'catalogue' | 'compact';

interface FilmListProps {
  films: Film[];
  categories: Category[];
  screenings?: Screening[];
  venues?: Venue[];
  onFilmClick: (film: Film) => void;
  isLoading?: boolean;
  regionLabelId?: string;
  emptyMessage?: React.ReactNode;
  testIdPrefix?: string;
  variant?: FilmListVariant;
}

const DEFAULT_EMPTY_MESSAGE = 'No films match your filters.';
const DEFAULT_TEST_ID = 'film';
const DEFAULT_VARIANT: FilmListVariant = 'catalogue';

/**
 * FilmList Component
 *
 * Displays a grid of film cards with support for different variants and loading states.
 * Optimized with React.memo for performance when rendering large lists.
 *
 * @param films - Array of film objects to display
 * @param categories - Array of category objects for film categorization
 * @param screenings - Optional array of screening objects for venue/time information
 * @param venues - Optional array of venue objects for location information
 * @param onFilmClick - Callback function called when a film card is clicked
 * @param isLoading - Whether to show loading skeleton instead of films
 * @param regionLabelId - ID of element that labels this region for accessibility
 * @param emptyMessage - Message to display when no films match filters
 * @param testIdPrefix - Prefix for test IDs to avoid conflicts
 * @param variant - Visual variant: 'catalogue' (default) or 'compact'
 */
export const FilmList: React.FC<FilmListProps> = React.memo(({
  films,
  categories,
  screenings = [],
  venues = [],
  onFilmClick,
  isLoading = false,
  regionLabelId,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  testIdPrefix = DEFAULT_TEST_ID,
  variant = DEFAULT_VARIANT,
}) => {
  const categoryMap = useMemo(() => {
    return categories.reduce<Record<string, Category>>((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {} as Record<string, Category>);
  }, [categories]);

  const screeningMap = useMemo(() => {
    return screenings.reduce<Record<string, Screening[]>>((acc, screening) => {
      if (!acc[screening.film_id]) {
        acc[screening.film_id] = [];
      }
      acc[screening.film_id].push(screening);
      return acc;
    }, {} as Record<string, Screening[]>);
  }, [screenings]);

  const venueLookup = useMemo(() => {
    return venues.reduce<Record<string, Venue>>((acc, venue) => {
      acc[venue.id] = venue;
      return acc;
    }, {} as Record<string, Venue>);
  }, [venues]);

  if (isLoading) {
    return <SkeletonGrid count={variant === 'compact' ? 4 : 8} />;
  }

  const gridTestId = `${testIdPrefix}-grid`;
  const gridItemTestId = `${testIdPrefix}-grid-item`;
  const emptyStateTestId = `${testIdPrefix}-empty`;

  return (
    <section
      role={regionLabelId ? 'region' : undefined}
      aria-labelledby={regionLabelId}
      className={variant === 'compact' ? 'film-grid-wrapper film-grid-wrapper--compact' : 'film-grid-wrapper'}
    >
      {films.length === 0 ? (
        <div
          className="film-grid-empty"
          data-testid={emptyStateTestId}
          aria-live="polite"
        >
          {typeof emptyMessage === 'string' ? (
            <p className="film-grid-empty__text">{emptyMessage}</p>
          ) : (
            emptyMessage
          )}
        </div>
      ) : (
        <ul
          className={`film-grid film-grid--${variant}`}

          data-testid={gridTestId}
          tabIndex={-1}
        >
          {films.map((film) => {
            const filmCategory = categoryMap[film.category_id] ?? null;
            const filmScreenings = screeningMap[film.id] ?? [];

            return (
              <li key={film.id} className="film-grid__item" data-testid={gridItemTestId}>
                <FilmCard
                  film={film}
                  category={filmCategory}
                  screenings={filmScreenings}
                  venues={venues.length ? venues : undefined}
                  venueLookup={venues.length ? venueLookup : undefined}
                  primaryVenueId={filmScreenings[0]?.venue_id}
                  onClick={onFilmClick}
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
});

FilmList.displayName = 'FilmList';
