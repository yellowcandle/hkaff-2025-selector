import React from 'react';
import { Film, Category } from '../../types';
import { FilmCard } from './FilmCard';

interface FilmListProps {
  films: Film[];
  categories: Category[];
  onFilmClick: (film: Film) => void;
}

export const FilmList: React.FC<FilmListProps> = ({ films, categories, onFilmClick }) => {
  const getCategoryById = (categoryId: string): Category | null => {
    return categories.find(cat => cat.id === categoryId) || null;
  };

  return (
    <div
      data-testid="film-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
    >
      {films.map((film) => (
        <FilmCard
          key={film.id}
          film={film}
          category={getCategoryById(film.category_id)}
          onClick={onFilmClick}
        />
      ))}
    </div>
  );
};
