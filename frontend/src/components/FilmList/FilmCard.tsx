import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { Film, Category, Screening } from '../../types';

interface FilmCardProps {
  film: Film;
  category: Category | null;
  screenings?: Screening[];
  onClick: (film: Film) => void;
  isInSchedule?: boolean;
  onToggleSchedule?: (film: Film) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const FilmCard: React.FC<FilmCardProps> = ({
  film,
  category,
  screenings = [],
  onClick,
  isInSchedule = false,
  onToggleSchedule,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = isZh ? film.title_tc : film.title_en;
  const categoryName = category ? (isZh ? category.name_tc : category.name_en) : '';
  const screeningsCount = screenings.length;

  // Determine special badges from film data (assume film has a 'special_label' field or derive from category/tags)
  const specialLabel = film.special_label || (categoryName.includes('Opening') ? 'Opening Film' : categoryName.includes('Closing') ? 'Closing Film' : categoryName.includes('Surprise') ? 'Surprise Screening' : '');

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="157" viewBox="0 0 280 157"%3E%3Crect fill="%23f3f4f6" width="280" height="157"/%3E%3Cg transform="translate(140,78.5)"%3E%3Cpath fill="%239ca3af" d="M-35-42h70v84h-70z"/%3E%3Ccircle fill="%239ca3af" cx="-21" cy="0" r="11"/%3E%3Ccircle fill="%239ca3af" cx="21" cy="0" r="11"/%3E%3C/g%3E%3C/svg%3E';
  };

  return (
    <article
      data-testid="film-card"
      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      tabIndex={0}
      role="figure"
      aria-label={`${title}, ${film.director}, ${film.runtime_minutes} min`}
    >
      {/* Poster Section */}
      <figure className="relative aspect-[16/9] bg-gray-200 overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Poster Image */}
        <img
          data-testid="film-poster"
          src={film.poster_url}
          alt={`${title} poster`}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Special Label Badge - Top Right */}
        {specialLabel && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold font-inter z-10 shadow-md" aria-label={specialLabel}>
            {specialLabel}
          </span>
        )}

        {/* Rating Badge - Top Left */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg font-inter">
            PG-13
          </span>
        </div>

        {/* Favorite Button - Top Left if applicable */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-2 left-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 z-10"
            aria-label={isFavorite ? (isZh ? '移除收藏' : 'Remove from favorites') : (isZh ? '加入收藏' : 'Add to favorites')}
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-4 h-4 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4 text-gray-600 hover:text-red-500" />
            )}
          </button>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-end p-4">
          <div className="text-white w-full">
            <h3 className="font-bold text-lg mb-1 font-inter line-clamp-2">{title}</h3>
            <p className="text-sm font-inter opacity-90">{film.director} • {film.runtime_minutes} min • {categoryName}</p>
          </div>
        </div>

        {/* Category Badge - Bottom */}
        {categoryName && !specialLabel && (
          <div className="absolute bottom-2 left-2 right-2">
            <span className="inline-block px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full font-inter">
              {categoryName}
            </span>
          </div>
        )}
      </figure>

      {/* Content Section */}
      <figcaption className="p-4">
        {/* Title */}
        <h3
          data-testid="film-title"
          className="font-semibold text-base mb-2 line-clamp-2 leading-tight font-inter text-gray-900"
        >
          {title}
        </h3>

        {/* Director • Year */}
        <p className="text-gray-600 text-sm mb-3 font-inter">
          {film.director} • 2025
        </p>

        {/* Metadata */}
        <div className="space-y-1.5 text-gray-600 text-xs mb-4 font-inter">
          {/* Runtime */}
          {film.runtime_minutes && (
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
              <span>{film.runtime_minutes} {isZh ? '分鐘' : 'min'}</span>
            </div>
          )}

          {/* Venue */}
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{isZh ? '各場地' : 'Various venues'}</span>
          </div>

          {/* Screenings Count */}
          {screeningsCount > 0 && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{screeningsCount} {isZh ? '場次' : 'screenings'}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onClick(film)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-inter focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={isZh ? `查看 ${title} 詳情` : `View details for ${title}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{isZh ? '詳情' : 'Details'}</span>
          </button>
          
          {onToggleSchedule && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSchedule(film);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg transition-all duration-200 font-inter focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isInSchedule
                  ? 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              }`}
              aria-label={isInSchedule ? (isZh ? `從時間表移除 ${title}` : `Remove ${title} from schedule`) : (isZh ? `加入 ${title} 到時間表` : `Add ${title} to schedule`)}
            >
              {isInSchedule ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{isZh ? '已加入' : 'Added'}</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{isZh ? '加入' : 'Add'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </figcaption>
    </article>
  );
};