import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Film, Category } from '../../types';

interface FilmCardProps {
  film: Film;
  category: Category | null;
  onClick: (film: Film) => void;
}

export const FilmCard: React.FC<FilmCardProps> = ({ film, category, onClick }) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = isZh ? film.title_tc : film.title_en;
  const categoryName = category ? (isZh ? category.name_tc : category.name_en) : '';

  // Simulated rating - you may want to add this to your Film type
  const rating = 'PG-13'; // Default rating

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect fill="%23f3f4f6" width="200" height="300"/%3E%3Cg transform="translate(100,150)"%3E%3Cpath fill="%239ca3af" d="M-25-30h50v60h-50z"/%3E%3Ccircle fill="%239ca3af" cx="-15" cy="0" r="8"/%3E%3Ccircle fill="%239ca3af" cx="15" cy="0" r="8"/%3E%3C/g%3E%3C/svg%3E';
  };

  // For now, we'll show a simulated screenings count - adjust based on your data
  const screeningsCount = 2; // You may want to pass this as a prop

  return (
    <div
      data-testid="film-card"
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col bg-white rounded-lg shadow-md"
    >
      {/* Poster Section */}
      <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Poster Image */}
        <img
          data-testid="film-poster"
          src={film.poster_url}
          alt={`${title} ${isZh ? '海報' : 'poster'}`}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Rating Badge - Top Right */}
        <div className="absolute top-2 right-2">
          <span className="bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
            {rating}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3
          data-testid="film-title"
          className="font-semibold text-gray-900 mb-1 line-clamp-1"
        >
          {title}
        </h3>

        {/* Director • Year */}
        <p className="text-gray-600 text-sm mb-3">
          {film.director} • {new Date().getFullYear()} {/* Adjust year if you have it in film data */}
        </p>

        {/* Genre Badges */}
        {categoryName && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span
              data-testid="film-category"
              className="text-xs border border-gray-300 text-gray-700 px-2 py-0.5 rounded"
            >
              {categoryName}
            </span>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-gray-600 text-sm mb-4">
          {/* Runtime */}
          {film.runtime_minutes && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{film.runtime_minutes} min</span>
            </div>
          )}

          {/* Venue - simplified */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{isZh ? '各場地' : 'Various venues'}</span>
          </div>

          {/* Screenings Count */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{screeningsCount} {isZh ? '場次' : 'screenings'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onClick(film)}
            className="flex-1 flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isZh ? '詳情' : 'Details'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(film);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isZh ? '加入' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};