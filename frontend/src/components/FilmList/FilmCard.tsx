import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartIcon, ClockIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { Film, Category, Screening, Venue } from '../../types';

interface FilmCardProps {
  film: Film;
  category: Category | null;
  screenings?: Screening[];
  venues?: Venue[];
  onClick: (film: Film) => void;
  isInSchedule?: boolean;
  onToggleSchedule?: (film: Film) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  rating?: string;
}

export const FilmCard: React.FC<FilmCardProps> = ({
  film,
  category,
  screenings = [],
  venues = [],
  onClick,
  isFavorite = false,
  onToggleFavorite,
  rating,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = isZh ? film.title_tc : film.title_en;
  const categoryName = category ? (isZh ? category.name_tc : category.name_en) : '';
  const screeningsCount = screenings.length;

  // Get unique venues for this film
  const filmVenues = screenings
    .map(s => venues.find(v => v.id === s.venue_id))
    .filter((v, i, arr) => v && arr.findIndex(v2 => v2?.id === v.id) === i)
    .slice(0, 2);

  const primaryVenue = filmVenues[0];

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="157" viewBox="0 0 280 157"%3E%3Crect fill="%23f3f4f6" width="280" height="157"/%3E%3Cg transform="translate(140,78.5)"%3E%3Cpath fill="%239ca3af" d="M-35-42h70v84h-70z"/%3E%3Ccircle fill="%239ca3af" cx="-21" cy="0" r="11"/%3E%3Ccircle fill="%239ca3af" cx="21" cy="0" r="11"/%3E%3C/g%3E%3C/svg%3E';
  };

  return (
    <article
      data-testid="film-card"
      onClick={() => onClick(film)}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl hover:border-purple-200 transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2"
      tabIndex={0}
      role="figure"
      aria-label={`${title}, ${film.director}, ${film.runtime_minutes} min`}
    >
      {/* Poster Section */}
      <figure className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
        )}

        {/* Poster Image */}
        <img
          data-testid="film-poster"
          src={film.poster_url}
          alt={`${title} poster`}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-gray-900/80 backdrop-blur-sm rounded text-white text-xs font-bold">
            {rating}
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 z-10 shadow-sm ${
              isFavorite ? 'scale-110' : 'hover:scale-105'
            }`}
            aria-label={isFavorite ? (isZh ? '移除收藏' : 'Remove from favorites') : (isZh ? '加入收藏' : 'Add to favorites')}
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-5 h-5 text-purple-600 animate-pulse" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-700 hover:text-purple-600 transition-colors" />
            )}
          </button>
        )}
      </figure>

      {/* Content Section */}
      <figcaption className="p-4">
        {/* Title */}
        <h3
          data-testid="film-title"
          className="font-semibold text-base mb-1 line-clamp-2 leading-tight font-inter text-gray-900"
        >
          {title}
        </h3>

        {/* Director & Year */}
        <p className="text-gray-600 text-sm mb-3 font-inter leading-tight">
          {film.director} • {new Date().getFullYear()}
        </p>

        {/* Category Tags */}
        {categoryName && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded font-inter">
              {categoryName}
            </span>
          </div>
        )}

        {/* Film Info - Reordered by importance: venue → screenings → runtime */}
        <div className="space-y-1.5 text-xs mb-3">
          {primaryVenue && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
              <MapPinIcon className="w-3.5 h-3.5 text-purple-600" />
              <span className="line-clamp-1 font-semibold text-gray-900">{isZh ? primaryVenue.name_tc : primaryVenue.name_en}</span>
            </div>
          )}
          {screeningsCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-md">
              <CalendarIcon className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-medium text-purple-700">{screeningsCount} {isZh ? '場放映' : 'screenings'}</span>
            </div>
          )}
          {film.runtime_minutes && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
              <ClockIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="font-medium text-gray-600">{film.runtime_minutes} {isZh ? '分鐘' : 'min'}</span>
            </div>
          )}
        </div>
      </figcaption>
    </article>
  );
};