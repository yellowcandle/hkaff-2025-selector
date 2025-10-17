import React from 'react';
import { Film, Category, Screening, Venue } from '../../types';
import { FilmCard } from './FilmCard';
import { SkeletonGrid } from '../Skeleton/SkeletonCard';

interface FilmListProps {
  films: Film[];
  categories: Category[];
  screenings?: Screening[];
  venues?: Venue[];
  onFilmClick: (film: Film) => void;
  isLoading?: boolean;
}

export const FilmList: React.FC<FilmListProps> = ({
  films,
  categories,
  screenings = [],
  venues = [],
  onFilmClick,
  isLoading = false
}) => {
  const getCategoryById = (categoryId: string): Category | null => {
    return categories.find(cat => cat.id === categoryId) || null;
  };

  const getScreeningsForFilm = (filmId: string): Screening[] => {
    return screenings.filter(s => s.film_id === filmId);
  };

  if (isLoading) {
    return <SkeletonGrid count={8} />;
  }

  return (
    <section
      data-testid="film-grid"
      aria-label="Film Grid"
    >
      {films.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 font-inter">No films match your filters.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6" role="list">
          {films.map((film) => (
            <li key={film.id}>
              <FilmCard
                film={film}
                category={getCategoryById(film.category_id)}
                screenings={getScreeningsForFilm(film.id)}
                venues={venues}
                onClick={onFilmClick}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
