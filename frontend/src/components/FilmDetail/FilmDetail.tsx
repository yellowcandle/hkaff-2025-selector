import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Film, Category, Screening, Venue } from '../../types';
import { ScreeningSelector } from './ScreeningSelector';

interface FilmDetailProps {
  film: Film;
  category: Category | null;
  screenings: Screening[];
  venues: Venue[];
  selectedScreeningIds: string[];
  onSelectScreening: (screening: Screening) => void;
  onClose: () => void;
}

export const FilmDetail: React.FC<FilmDetailProps> = ({
  film,
  category,
  screenings,
  venues,
  selectedScreeningIds,
  onSelectScreening,
  onClose,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const title = isZh ? film.title_tc : film.title_en;
  const synopsis = isZh ? film.synopsis_tc : film.synopsis_en;
  const categoryName = category ? (isZh ? category.name_tc : category.name_en) : '';

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        data-testid="film-detail-modal"
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          data-testid="close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Film Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={film.poster_url}
                alt={title}
                className="w-48 h-72 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="192" height="288" viewBox="0 0 192 288"%3E%3Crect fill="%23e5e7eb" width="192" height="288"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Film Info */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h2>

              {categoryName && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md mb-4">
                  {categoryName}
                </span>
              )}

              <div className="space-y-2 text-gray-700">
                <div data-testid="film-director" className="flex">
                  <span className="font-semibold w-24">{isZh ? '導演' : 'Director'}:</span>
                  <span>{film.director}</span>
                </div>

                <div data-testid="film-country" className="flex">
                  <span className="font-semibold w-24">{isZh ? '國家' : 'Country'}:</span>
                  <span>{film.country}</span>
                </div>

                <div data-testid="film-runtime" className="flex">
                  <span className="font-semibold w-24">{isZh ? '片長' : 'Runtime'}:</span>
                  <span>{film.runtime_minutes} {isZh ? '分鐘' : 'minutes'}</span>
                </div>
              </div>

              <div data-testid="film-synopsis" className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {isZh ? '劇情簡介' : 'Synopsis'}
                </h3>
                <p className="text-gray-700 leading-relaxed">{synopsis}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Screenings Section */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {isZh ? '放映場次' : 'Screenings'}
          </h3>

          <ScreeningSelector
            screenings={screenings}
            venues={venues}
            selectedScreeningIds={selectedScreeningIds}
            onSelectScreening={onSelectScreening}
          />
        </div>
      </div>
    </div>
  );
};
