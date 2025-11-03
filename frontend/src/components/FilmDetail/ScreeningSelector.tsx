import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Screening, Venue } from '../../types';
import type { UserSelection, Conflict } from '../../../../specs/001-given-this-film/contracts/service-interfaces';
import { conflictDetector } from '../../services/conflictDetector';


interface ScreeningSelectorProps {
  screenings: Screening[];
  venues: Venue[];
  selectedScreeningIds: string[];
  existingSelections?: UserSelection[];
  onSelectScreening: (screening: Screening) => void;
}

export const ScreeningSelector: React.FC<ScreeningSelectorProps> = ({
  screenings,
  venues,
  selectedScreeningIds,
  existingSelections = [],
  onSelectScreening,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';
  const [previewedScreeningId, setPreviewedScreeningId] = useState<string | null>(null);

  const getVenueById = (venueId: string): Venue | null => {
    return venues.find(v => v.id === venueId) || null;
  };

  const formatDateTime = (datetime: string): { date: string; time: string; dayOfWeek: string } => {
    const date = new Date(datetime);
    const dayOfWeek = isZh 
      ? ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()]
      : format(date, 'EEEE');
    return {
      date: format(date, 'yyyy-MM-dd'),
      time: format(date, 'HH:mm'),
      dayOfWeek,
    };
  };


  // Check for conflicts using the conflictDetector service
  const checkConflictForScreening = (screening: Screening): Conflict[] => {
    if (!existingSelections.length) return [];
    
    // Look up venue information for accurate conflict detection
    const venue = getVenueById(screening.venue_id);
    const venueNameEn = venue?.name_en || '';
    const venueNameTc = venue?.name_tc || '';
    
    // Use the conflictDetector service's wouldConflict method
    return conflictDetector.wouldConflict(existingSelections, screening, venueNameEn, venueNameTc);
  };

  // Format conflict messages based on Conflict objects
  const formatConflictMessage = (conflict: Conflict): string => {
    const otherSelection = conflict.screening_a.screening_id === previewedScreeningId 
      ? conflict.screening_b 
      : conflict.screening_a;
    
    if (conflict.severity === 'impossible') {
      const minutes = Math.round(conflict.overlap_minutes);
      return isZh
        ? `與 "${otherSelection.film_snapshot.title_tc}" 重疊 ${minutes} 分鐘`
        : `Overlaps ${minutes} minutes with "${otherSelection.film_snapshot.title_en}"`;
    } else {
      return isZh
        ? `與 "${otherSelection.film_snapshot.title_tc}" 間隔少於30分鐘，且在不同場地`
        : `Less than 30 minutes from "${otherSelection.film_snapshot.title_en}" at different venue`;
    }
  };

  if (screenings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {isZh ? '暫無放映場次' : 'No screenings available'}
      </div>
    );
  }

  return (
    <div data-testid="screenings-list" className="space-y-3">
      {screenings.map((screening) => {
        const venue = getVenueById(screening.venue_id);
        const { date, time, dayOfWeek } = formatDateTime(screening.datetime);
        const isSelected = selectedScreeningIds.includes(screening.id);
        const isPreviewed = previewedScreeningId === screening.id;
        const conflicts = isPreviewed && !isSelected ? checkConflictForScreening(screening) : [];
        const hasConflict = conflicts.length > 0;
        const severity = hasConflict ? conflicts[0].severity : null;

        return (
          <div
            key={screening.id}
            data-testid="screening-item"
            className="border rounded-lg transition-colors border-border hover:bg-muted/50"
          >
            {/* Conflict Warning Banner - shown only on hover/focus */}
            {hasConflict && (
              <div
                role="alert"
                aria-live="polite"
                className={`mx-4 mt-4 mb-2 p-3 rounded-md border-l-4 ${
                  severity === 'impossible'
                    ? 'bg-red-50 border-red-400'
                    : 'bg-yellow-50 border-yellow-400'
                }`}
              >
                <div className="flex items-start">
                  <svg
                    className={`h-5 w-5 mr-2 flex-shrink-0 ${
                      severity === 'impossible' ? 'text-red-400' : 'text-yellow-400'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className={`text-sm font-medium ${
                      severity === 'impossible' ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      {isZh ? '選擇此場次將產生衝突：' : 'Selecting this will create conflicts:'}
                    </p>
                    {conflicts.map((conflict, idx) => (
                      <p
                        key={idx}
                        className={`text-xs mt-1 ${
                          severity === 'impossible' ? 'text-red-700' : 'text-yellow-700'
                        }`}
                      >
                        {formatConflictMessage(conflict)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Screening Info */}
                <div className="flex-1">
                  <div data-testid="screening-datetime" className="font-semibold text-foreground mb-1">
                    {date} ({dayOfWeek}) {time}
                  </div>

                  <div data-testid="screening-venue" className="text-muted-foreground text-sm">
                    {venue ? (isZh ? venue.name_tc : venue.name_en) : screening.venue_id}
                  </div>

                  <div className="text-muted-foreground text-sm mt-1">
                    {screening.duration_minutes} {isZh ? '分鐘' : 'minutes'} • {screening.language}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  data-testid="select-screening-btn"
                  onClick={() => onSelectScreening(screening)}
                  onMouseEnter={() => setPreviewedScreeningId(screening.id)}
                  onMouseLeave={() => setPreviewedScreeningId(null)}
                  onFocus={() => setPreviewedScreeningId(screening.id)}
                  onBlur={() => setPreviewedScreeningId(null)}
                  disabled={isSelected}
                  aria-label={
                    isSelected
                      ? (isZh ? '已選擇此場次' : 'Screening already selected')
                      : (isZh ? '選擇此場次' : 'Select this screening')
                  }
                  className={`min-h-[44px] px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSelected
                    ? (isZh ? '已選擇' : 'Selected')
                    : (isZh ? '選擇' : 'Select')}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
