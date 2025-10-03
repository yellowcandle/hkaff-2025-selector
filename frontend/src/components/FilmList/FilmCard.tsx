import React from 'react';
import { useTranslation } from 'react-i18next';
import { Film, Category } from '../../types';

interface FilmCardProps {
  film: Film;
  category: Category | null;
  onClick: (film: Film) => void;
}

// Category color mapping helper - maps category names/types to colors
const getCategoryColorClass = (category: Category | null): string => {
  if (!category) return 'bg-primary';
  
  const nameEn = category.name_en?.toLowerCase() || '';
  const nameTc = category.name_tc || '';
  
  // Map based on category name/type
  if (nameEn.includes('opening') || nameTc.includes('開幕')) return 'bg-[#C72E3A]'; // Primary red
  if (nameEn.includes('closing') || nameTc.includes('閉幕')) return 'bg-[#E8B339]'; // Gold
  if (nameEn.includes('special') || nameTc.includes('特別') || nameTc.includes('隆重')) return 'bg-[#5E35B1]'; // Purple
  if (nameEn.includes('asian') || nameTc.includes('亞洲')) return 'bg-[#3B82F6]'; // Blue
  if (nameEn.includes('fan') || nameTc.includes('影迷')) return 'bg-[#EC4899]'; // Pink
  if (nameEn.includes('talent') || nameTc.includes('新秀')) return 'bg-[#10B981]'; // Green
  if (nameEn.includes('short') || nameTc.includes('短片')) return 'bg-[#F59E0B]'; // Orange
  if (nameEn.includes('documentary') || nameTc.includes('紀錄')) return 'bg-[#14B8A6]'; // Teal
  if (nameEn.includes('animation') || nameTc.includes('動畫')) return 'bg-[#A855F7]'; // Purple variant
  if (nameEn.includes('retrospective') || nameTc.includes('回顧')) return 'bg-[#6366F1]'; // Indigo
  
  // Default fallback
  return 'bg-primary';
};

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
      className="group relative w-full bg-card rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none text-left"
    >
      {/* Poster Image with Gradient Overlay */}
      <div className="relative aspect-[2/3] bg-muted overflow-hidden">
        <img
          data-testid="film-poster"
          src={film.poster_url}
          alt={`${title} poster`}
          loading="lazy"
          decoding="async"
          width="300"
          height="450"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: '2/3' }}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect fill="%23f3f4f6" width="200" height="300"/%3E%3Cg transform="translate(100,150)"%3E%3Cpath fill="%239ca3af" d="M-25-30h50v60h-50z"/%3E%3Ccircle fill="%239ca3af" cx="-15" cy="0" r="8"/%3E%3Ccircle fill="%239ca3af" cx="15" cy="0" r="8"/%3E%3C/g%3E%3C/svg%3E';
          }}
        />
        
        {/* Gradient overlay on hover for better depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Film Info Section */}
      <div className="p-4 space-y-3">
        {/* Category Badge - Color coded for quick visual identification */}
        {categoryName && (
          <div className="flex items-center gap-2">
            <span
              data-testid="film-category"
              className={`inline-flex items-center px-3 py-1 text-xs font-semibold text-white rounded-full shadow-sm ${getCategoryColorClass(category)}`}
              aria-label={`Category: ${categoryName}`}
            >
              {categoryName}
            </span>
          </div>
        )}
        
        {/* Film Title - Enhanced typography */}
        <h3
          data-testid="film-title"
          className="font-semibold text-foreground text-lg leading-tight line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors"
        >
          {title}
        </h3>

        {/* Metadata Row - Director */}
        {film.director && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="line-clamp-1">{film.director}</span>
          </div>
        )}
        
        {/* Metadata Row - Country & Runtime */}
        {(film.country || film.runtime_minutes) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <span className="line-clamp-1">
              {film.country}
              {film.country && film.runtime_minutes && (
                <span className="text-border mx-1">•</span>
              )}
              {film.runtime_minutes && `${film.runtime_minutes} min`}
            </span>
          </div>
        )}
      </div>

      {/* Hover Indicator - Arrow in circle */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};
