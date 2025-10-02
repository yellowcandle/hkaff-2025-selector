import React from 'react';
import { useTranslation } from 'react-i18next';
import { Film, Category } from '../../types';

interface FilmCardProps {
  film: Film;
  category: Category | null;
  onClick: (film: Film) => void;
}

export const FilmCard: React.FC<FilmCardProps> = ({ film, category, onClick }) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const title = isZh ? film.title_tc : film.title_en;
  const categoryName = category ? (isZh ? category.name_tc : category.name_en) : '';

  return (
    <button
      data-testid="film-card"
      onClick={() => onClick(film)}
      aria-label={`${title}${categoryName ? ` - ${categoryName}` : ''}`}
      className="w-full bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-left"
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] bg-gray-200 relative">
        <img
          data-testid="film-poster"
          src={film.poster_url}
          alt={`${title} poster`}
          loading="lazy"
          decoding="async"
          width="300"
          height="450"
          className="w-full h-full object-cover"
          style={{ aspectRatio: '2/3' }}
          onError={(e) => {
            // Fallback for missing images
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect fill="%23e5e7eb" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Film Info */}
      <div className="p-4">
        <h3
          data-testid="film-title"
          className="font-semibold text-gray-900 text-sm md:text-base mb-2 line-clamp-2 min-h-[2.5rem]"
        >
          {title}
        </h3>

        {categoryName && (
          <span
            data-testid="film-category"
            className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
            aria-label={`Category: ${categoryName}`}
          >
            {categoryName}
          </span>
        )}
      </div>
    </button>
  );
};
