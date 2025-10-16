import React, { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  const title = isZh ? film.title_tc : film.title_en;
  const synopsis = isZh ? film.synopsis_tc : film.synopsis_en;
  const categoryName = category ? (isZh ? category.name_tc : category.name_en) : '';

  return (
    <button
      data-testid="film-card"
      onClick={() => onClick(film)}
      aria-label={`${title}${categoryName ? ` - ${categoryName}` : ''}`}
      className="group relative w-full bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none text-left border border-gray-100 flex flex-col h-full"
    >
      <div className="relative aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          data-testid="film-poster"
          src={film.poster_url}
          alt={`${title} poster`}
          loading="lazy"
          decoding="async"
          width="300"
          height="450"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ aspectRatio: '2/3' }}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect fill="%23f3f4f6" width="200" height="300"/%3E%3Cg transform="translate(100,150)"%3E%3Cpath fill="%239ca3af" d="M-25-30h50v60h-50z"/%3E%3Ccircle fill="%239ca3af" cx="-15" cy="0" r="8"/%3E%3Ccircle fill="%239ca3af" cx="15" cy="0" r="8"/%3E%3C/g%3E%3C/svg%3E';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {categoryName && (
          <div className="flex items-center gap-2">
            <span
              data-testid="film-category"
              className="inline-flex items-center px-2.5 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm"
              aria-label={`Category: ${categoryName}`}
            >
              {categoryName}
            </span>
          </div>
        )}

        <h3
          data-testid="film-title"
          className="font-bold text-black text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors"
        >
          {title}
        </h3>

        {film.director && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="line-clamp-1">{film.director}</span>
          </div>
        )}

        {film.country && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <span className="line-clamp-1">{film.country}</span>
          </div>
        )}

        {film.runtime_minutes && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{film.runtime_minutes} {isZh ? '分鐘' : 'min'}</span>
          </div>
        )}

        {synopsis && (
          <div className="mt-auto pt-2 border-t border-gray-200">
            {isExpanded ? (
              <p className="text-xs text-gray-600 line-clamp-4">{synopsis}</p>
            ) : (
              <p className="text-xs text-gray-600 line-clamp-2">{synopsis}</p>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              aria-label={isExpanded ? (isZh ? '隱藏簡介' : 'Hide synopsis') : (isZh ? '顯示簡介' : 'Show synopsis')}
            >
              <span>{isExpanded ? (isZh ? '隱藏' : 'Hide') : (isZh ? '更多' : 'More')}</span>
              <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </button>
  );
};
