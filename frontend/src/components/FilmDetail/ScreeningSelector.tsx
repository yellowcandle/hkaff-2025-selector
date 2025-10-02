import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Screening, Venue } from '../../types';
import type { UserSelection } from '../../../../specs/001-given-this-film/contracts/service-interfaces';

interface ConflictPreview {
  severity: 'impossible' | 'warning';
  message: string;
}

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

  // Check for conflicts with existing selections
  const getConflictPreview = (screening: Screening): ConflictPreview | null => {
    if (!existingSelections.length) return null;

    const screeningStart = new Date(screening.datetime).getTime();
    const screeningEnd = screeningStart + screening.duration_minutes * 60000;
    const venue = getVenueById(screening.venue_id);

    for (const selection of existingSelections) {
      const existingStart = new Date(selection.screening_snapshot.datetime).getTime();
      const existingEnd = existingStart + selection.screening_snapshot.duration_minutes * 60000;

      // Check for time overlap
      const overlapStart = Math.max(screeningStart, existingStart);
      const overlapEnd = Math.min(screeningEnd, existingEnd);
      const overlapMinutes = Math.max(0, overlapEnd - overlapStart) / 60000;

      if (overlapMinutes > 0) {
        return {
          severity: 'impossible',
          message: isZh
            ? `與 "${selection.film_snapshot.title_tc}" 重疊 ${Math.round(overlapMinutes)} 分鐘`
            : `Overlaps ${Math.round(overlapMinutes)} minutes with "${selection.film_snapshot.title_en}"`
        };
      }

      // Check for tight timing at different venues
      const gap = Math.abs(screeningStart - existingEnd);
      const gapMinutes = gap / 60000;
      const existingVenueName = selection.screening_snapshot.venue_name_en;
      const differentVenue = venue && existingVenueName && venue.name_en !== existingVenueName;

      if (differentVenue && gapMinutes < 30) {
        return {
          severity: 'warning',
          message: isZh
            ? `與 "${selection.film_snapshot.title_tc}" 間隔少於30分鐘，且在不同場地`
            : `Less than 30 minutes from "${selection.film_snapshot.title_en}" at different venue`
        };
      }
    }

    return null;
  };

  if (screenings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
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
        const conflict = !isSelected ? getConflictPreview(screening) : null;

        return (
          <div
            key={screening.id}
            data-testid="screening-item"
            className={`border rounded-lg p-4 transition-colors ${
              conflict?.severity === 'impossible'
                ? 'border-red-300 bg-red-50'
                : conflict?.severity === 'warning'
                ? 'border-yellow-300 bg-yellow-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col gap-3">
              {/* Conflict Warning Banner */}
              {conflict && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`flex items-start gap-2 p-3 rounded-md ${
                    conflict.severity === 'impossible'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
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
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {conflict.severity === 'impossible'
                        ? (isZh ? '時間衝突' : 'Schedule Conflict')
                        : (isZh ? '注意事項' : 'Warning')}
                    </p>
                    <p className="text-sm mt-1">{conflict.message}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Screening Info */}
                <div className="flex-1">
                  <div data-testid="screening-datetime" className="font-semibold text-gray-900 mb-1">
                    {date} ({dayOfWeek}) {time}
                  </div>

                  <div data-testid="screening-venue" className="text-gray-600 text-sm">
                    {venue ? (isZh ? venue.name_tc : venue.name_en) : screening.venue_id}
                  </div>

                  <div className="text-gray-500 text-sm mt-1">
                    {screening.duration_minutes} {isZh ? '分鐘' : 'minutes'} • {screening.language}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  data-testid="select-screening-btn"
                  onClick={() => onSelectScreening(screening)}
                  disabled={isSelected}
                  aria-label={
                    isSelected
                      ? (isZh ? '已選擇此場次' : 'Screening already selected')
                      : conflict?.severity === 'impossible'
                      ? (isZh ? '選擇此場次（有時間衝突）' : 'Select screening (has conflict)')
                      : (isZh ? '選擇此場次' : 'Select this screening')
                  }
                  className={`min-h-[44px] px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : conflict?.severity === 'impossible'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : conflict?.severity === 'warning'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
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
