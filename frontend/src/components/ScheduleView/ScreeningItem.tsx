import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Selection, ConflictInfo } from '../../types';
import { ConflictWarning } from './ConflictWarning';

interface ScreeningItemProps {
  selection: Selection;
  conflicts?: ConflictInfo[];
  onRemove: (screeningId: string) => void;
}

export const ScreeningItem: React.FC<ScreeningItemProps> = ({
  selection,
  conflicts,
  onRemove,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const { film_snapshot, screening_snapshot, venue_snapshot } = selection;

  const filmTitle = isZh ? film_snapshot.title_tc : film_snapshot.title_en;
  const venueName = isZh ? venue_snapshot.name_tc : venue_snapshot.name_en;
  const time = format(new Date(screening_snapshot.datetime), 'HH:mm');

  const hasConflicts = conflicts && conflicts.length > 0;

  return (
    <div data-testid="schedule-item" className="bg-card rounded-lg p-4 border border-border shadow-sm">
      <div className="flex items-start justify-between gap-4">
        {/* Screening Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {/* Conflict Icon */}
            {hasConflicts && (
              <div data-testid="conflict-icon" className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span data-testid="schedule-time" className="text-lg font-bold text-foreground">
                  {time}
                </span>
                <span data-testid="schedule-film-title" className="text-foreground font-medium">
                  {filmTitle}
                </span>
              </div>

              <div data-testid="schedule-venue" className="text-muted-foreground text-sm mb-1">
                {venueName}
              </div>

              <div className="text-muted-foreground text-xs">
                {screening_snapshot.duration_minutes} {isZh ? '分鐘' : 'minutes'}
              </div>

              {/* Conflict Warnings */}
              {hasConflicts && (
                <div className="mt-3">
                  {conflicts.map((conflict, idx) => (
                    <ConflictWarning key={idx} conflict={conflict} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button
          data-testid="remove-screening-btn"
          onClick={() => onRemove(selection.screening_id)}
          className="flex-shrink-0 min-h-[44px] min-w-[44px] p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors focus:ring-2 focus:ring-red-500"
          aria-label={isZh ? `移除 ${filmTitle} - ${time}` : `Remove ${filmTitle} at ${time}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
