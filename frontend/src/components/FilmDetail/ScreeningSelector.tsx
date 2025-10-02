import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Screening, Venue } from '../../types';

interface ScreeningSelectorProps {
  screenings: Screening[];
  venues: Venue[];
  selectedScreeningIds: string[];
  onSelectScreening: (screening: Screening) => void;
}

export const ScreeningSelector: React.FC<ScreeningSelectorProps> = ({
  screenings,
  venues,
  selectedScreeningIds,
  onSelectScreening,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const getVenueById = (venueId: string): Venue | null => {
    return venues.find(v => v.id === venueId) || null;
  };

  const formatDateTime = (datetime: string): { date: string; time: string; dayOfWeek: string } => {
    const date = new Date(datetime);
    return {
      date: format(date, 'yyyy-MM-dd'),
      time: format(date, 'HH:mm'),
      dayOfWeek: format(date, 'EEEE'),
    };
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

        return (
          <div
            key={screening.id}
            data-testid="screening-item"
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
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
                className={`px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSelected
                  ? (isZh ? '已選擇' : 'Selected')
                  : (isZh ? '選擇' : 'Select')}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
