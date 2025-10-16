import React from 'react';
import { Film, Category } from '../../types';
import { FilmCard } from './FilmCard';
import { SkeletonGrid } from '../Skeleton/SkeletonCard';

interface FilmListProps {
  films: Film[];
  categories: Category[];
  onFilmClick: (film: Film) => void;
  isLoading?: boolean;
}

export const FilmList: React.FC<FilmListProps> = ({ films, categories, onFilmClick, isLoading = false }) => {
  const getCategoryById = (categoryId: string): Category | null => {
    return categories.find(cat => cat.id === categoryId) || null;
  };

  if (isLoading) {
    return <SkeletonGrid count={8} />;
  }

  return (
    <section 
      data-testid="film-grid" 
      className="py-8 px-4 max-w-7xl mx-auto" 
      aria-label="Film Grid"
      role="main"
    >
      {films.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 font-inter">No films match your filters.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6" role="list">
          {films.map((film) => (
            <li key={film.id}>
              <FilmCard
                film={film}
                category={getCategoryById(film.category_id)}
                onClick={onFilmClick}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
