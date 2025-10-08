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
  const isZh = i18n.language === 'tc';

  const title = isZh ? film.title_tc : film.title_en;
  const categoryName = category ? (isZh ? category.name_tc : category.name_en) : '';

  return (
    <button
      data-testid="film-card"
      onClick={() => onClick(film)}
      aria-label={`${title}${categoryName ? ` - ${categoryName}` : ''}`}
      className="group relative w-full bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none text-left border border-gray-100"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
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
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect fill="%23f3f4f6" width="200" height="300"/%3E%3Cg transform="translate(100,150)"%3E%3Cpath fill="%239ca3af" d="M-25-30h50v60h-50z"/%3E%3Ccircle fill="%239ca3af" cx="-15" cy="0" r="8"/%3E%3Ccircle fill="%239ca3af" cx="15" cy="0" r="8"/%3E%3C/g%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Film Info Section */}
      <div className="p-4 space-y-2">
        {/* Category Badge */}
        {categoryName && (
          <div className="flex items-center gap-2">
            <span
              data-testid="film-category"
              className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-black bg-[#FF9933] rounded"
              aria-label={`Category: ${categoryName}`}
            >
              {categoryName}
            </span>
          </div>
        )}
        
        {/* Film Title */}
        <h3
          data-testid="film-title"
          className="font-semibold text-black text-base leading-tight line-clamp-2"
        >
          {title}
        </h3>

        {/* Metadata Row - Director */}
        {film.director && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="line-clamp-1">{film.director}</span>
          </div>
        )}
        
        {/* Metadata Row - Country */}
        {film.country && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <span className="line-clamp-1">{film.country}</span>
          </div>
        )}
      </div>
    </button>
  );
};
