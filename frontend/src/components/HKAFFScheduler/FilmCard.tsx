import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Clock, MapPin, ChevronDown, ChevronUp, Check, AlertTriangle } from 'lucide-react';
import type { FilmWithScreenings } from '../../types';
import { conflictDetector } from '../../services/conflictDetector';
import type { Conflict } from '../../../../specs/001-given-this-film/contracts/service-interfaces';
import type { UserSelection } from '../../../../specs/001-given-this-film/contracts/service-interfaces';

interface FilmCardProps {
  film: FilmWithScreenings;
  selectedScreenings: string[];
  existingSelections: UserSelection[];
  onToggleScreening: (screeningId: string) => void;
  onShowDetails: (filmId: string) => void;
  getVenueById: (venueId: string) => { id: string; name_tc: string; name_en: string } | undefined;
}

export function FilmCard({
  film,
  selectedScreenings,
  existingSelections,
  onToggleScreening,
  onShowDetails,
  getVenueById
}: FilmCardProps) {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [isExpanded, setIsExpanded] = useState(false);

  const checkConflictForScreening = (screeningId: string): Conflict[] => {
    if (!existingSelections.length) return [];
    
    const screening = film.screenings.find(s => s.id === screeningId);
    if (!screening) return [];

    const venue = getVenueById(screening.venue_id);
    const venueNameEn = venue?.name_en || '';
    const venueNameTc = venue?.name_tc || '';
    
    return conflictDetector.wouldConflict(existingSelections, screening, venueNameEn, venueNameTc);
  };

  const title = isZh ? film.film.title_tc : film.film.title_en;
  const director = film.film.director;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-150">
      <div className="w-full aspect-[2/3] overflow-hidden bg-gray-100">
        <img
          src={film.film.poster_url || '/placeholder-poster.jpg'}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600">{director || '—'} • 2025</p>
          
          <div className="mt-2">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {isZh ? film.category.name_tc : film.category.name_en}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-3">
          <button
            className="w-full flex justify-between items-center px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            <span>
              {film.screenings.length} {film.screenings.length === 1 ? (isZh ? '場放映' : 'screening') : (isZh ? '場放映' : 'screenings')}
            </span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-2">
              {film.screenings.map((screening) => {
                const venue = getVenueById(screening.venue_id);
                const isSelected = selectedScreenings.includes(screening.id);
                const conflicts = checkConflictForScreening(screening.id);
                const hasConflict = conflicts.length > 0;
                const conflictSeverity = conflicts.length > 0 
                  ? conflicts[0].severity 
                  : undefined;

                return (
                  <div
                    key={screening.id}
                    className={`p-3 rounded border transition-colors duration-150 ${
                      isSelected 
                        ? 'bg-green-50 border-green-500' 
                        : hasConflict
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock size={12} />
                        <span>{format(new Date(screening.datetime), 'MMM dd HH:mm')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin size={12} />
                        <span className="line-clamp-1">{isZh ? venue?.name_tc : venue?.name_en}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {screening.duration_minutes} {isZh ? '分鐘' : 'min'}
                      </div>
                    </div>

                    {hasConflict && !isSelected && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-orange-100 rounded text-orange-800 mb-2">
                        <AlertTriangle size={12} />
                        <span className="text-xs font-medium">
                          {conflictSeverity === 'impossible' 
                            ? (isZh ? '時間重疊' : 'Overlaps') 
                            : (isZh ? '換場緊迫' : 'Tight timing')}
                        </span>
                      </div>
                    )}

                    <button
                      className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={() => onToggleScreening(screening.id)}
                    >
                      {isSelected ? (
                        <>
                          <Check size={14} />
                          <span>{t('screening.selected')}</span>
                        </>
                      ) : (
                        <span>{t('screening.select')}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          className="w-full mt-3 py-2 px-4 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => onShowDetails(film.film.id)}
        >
          {t('filmCard.details')}
        </button>
      </div>
    </div>
  );
}
