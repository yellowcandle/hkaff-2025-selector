import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Clock, MapPin, Calendar } from 'lucide-react';
import type { Film, Category, Screening, Venue } from '../../types';
import './FilmCard.css';

type VenueLookup = Record<string, Venue>;

interface FilmCardProps {
  film: Film;
  category: Category | null;
  screenings?: Screening[];
  venues?: Venue[];
  venueLookup?: VenueLookup;
  primaryVenueId?: string;
  onClick: (film: Film) => void;
  isInSchedule?: boolean;
  onToggleSchedule?: (film: Film) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  rating?: string;
}

/**
 * FilmCard Component
 *
 * Displays a single film with poster, title, director, category, and screening information.
 * Supports favorite toggling and accessibility features.
 * Optimized with React.memo for performance in large lists.
 *
 * @param film - Film object containing title, director, runtime, etc.
 * @param category - Category object for film classification
 * @param screenings - Array of screening objects for this film
 * @param venues - Array of venue objects (used if venueLookup not provided)
 * @param venueLookup - Lookup map of venue objects by ID for performance
 * @param primaryVenueId - ID of primary venue to highlight
 * @param onClick - Callback when card is clicked
 * @param isFavorite - Whether film is marked as favorite
 * @param onToggleFavorite - Callback to toggle favorite status
 * @param rating - Optional rating badge to display
 */
export const FilmCard: React.FC<FilmCardProps> = React.memo(({
  film,
  category,
  screenings = [],
  venues = [],
  venueLookup,
  primaryVenueId,
  onClick,
  isFavorite = false,
  onToggleFavorite,
  rating,
}) => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = isZh ? film.title_tc : film.title_en;
  const categoryName = category ? (isZh ? category.name_tc : category.name_en) : '';
  const screeningsCount = screenings.length;

  const filmVenues = useMemo(() => {
    return screenings.reduce<Venue[]>((acc, screening) => {
      const resolvedVenue = venueLookup?.[screening.venue_id] ?? venues.find(v => v.id === screening.venue_id);
      if (resolvedVenue && !acc.some(existing => existing.id === resolvedVenue.id)) {
        acc.push(resolvedVenue);
      }
      return acc;
    }, []);
  }, [screenings, venueLookup, venues]);

  const primaryVenue = useMemo(() => {
    if (primaryVenueId) {
      const fromLookup = venueLookup?.[primaryVenueId];
      if (fromLookup) {
        return fromLookup;
      }
      const fromVenues = filmVenues.find(v => v.id === primaryVenueId);
      if (fromVenues) {
        return fromVenues;
      }
    }
    return filmVenues[0];
  }, [primaryVenueId, venueLookup, filmVenues]);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="157" viewBox="0 0 280 157"%3E%3Crect fill="%23f3f4f6" width="280" height="157"/%3E%3Cg transform="translate(140,78.5)"%3E%3Cpath fill="%239ca3af" d="M-35-42h70v84h-70z"/%3E%3Ccircle fill="%239ca3af" cx="-21" cy="0" r="11"/%3E%3Ccircle fill="%239ca3af" cx="21" cy="0" r="11"/%3E%3C/g%3E%3C/svg%3E';
  };



  return (
    <button
      data-testid="film-card"
      onClick={() => onClick(film)}
      className="film-card"
      type="button"
      aria-label={`${title}, ${t('filmCard.director')}: ${film.director}, ${t('filmCard.runtime', { minutes: film.runtime_minutes })}`}
    >
      {/* Poster Section */}
      <div className="film-card__poster">
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="film-card__skeleton" />
        )}

        {/* Poster Image */}
        <img
          data-testid="film-poster"
          src={film.poster_url}
          alt={t('filmCard.posterAlt', { title })}
          loading="lazy"
          decoding="async"
          className="film-card__poster-img"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Rating Badge */}
        {rating && (
          <div className="film-card__rating">
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
              }
            }}
            className={`film-card__favorite-btn ${isFavorite ? 'film-card__favorite-btn--favorited' : ''}`}
            aria-label={isFavorite ? t('filmCard.removeFavorite', { title }) : t('filmCard.addFavorite', { title })}
            tabIndex={0}
          >
            <Heart className="film-card__favorite-icon" fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Content Section */}
      <figcaption className="film-card__content">
        {/* Title */}
        <h3
          data-testid="film-title"
          className="film-card__title"
        >
          {title}
        </h3>

        {/* Director & Year */}
        <p className="film-card__meta">
          {film.director} • {new Date().getFullYear()}
        </p>

        {/* Category Tags */}
        {categoryName && (
          <div className="film-card__categories">
            <span className="film-card__category-tag">
              {categoryName}
            </span>
          </div>
        )}

        {/* Film Info - Reordered by importance: venue → screenings → runtime */}
        <div className="film-card__info">
          {primaryVenue && (
            <div className="film-card__info-item film-card__info-item--venue">
              <MapPin className="film-card__info-icon" aria-hidden="true" />
              <span className="film-card__info-text film-card__info-text--venue">{isZh ? primaryVenue.name_tc : primaryVenue.name_en}</span>
            </div>
          )}
          {screeningsCount > 0 && (
            <div className="film-card__info-item film-card__info-item--screenings">
              <Calendar className="film-card__info-icon" aria-hidden="true" />
              <span className="film-card__info-text film-card__info-text--screenings">{t('filmCard.screenings', { count: screeningsCount })}</span>
            </div>
          )}
          {film.runtime_minutes && (
            <div className="film-card__info-item film-card__info-item--runtime">
              <Clock className="film-card__info-icon" aria-hidden="true" />
              <span className="film-card__info-text film-card__info-text--runtime">{t('filmCard.runtime', { minutes: film.runtime_minutes })}</span>
            </div>
          )}
        </div>
      </figcaption>
    </button>
  );
});

FilmCard.displayName = 'FilmCard';
