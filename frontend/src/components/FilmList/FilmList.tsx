import React from 'react';
import { Film, Category } from '../../types';
import { FilmCard } from './FilmCard';
import { SkeletonGrid } from '../Skeleton/SkeletonCard';
import './FilmList.css';

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
    <div
      data-testid="film-grid"
      className="film-grid"
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
