import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Selection, ConflictInfo } from '../../types';
import { DateGroup as DateGroupComponent } from './DateGroup';

interface ScheduleViewProps {
  selections: Selection[];
  onRemoveScreening: (screeningId: string) => void;
  onExport: () => void;
}

interface DateGroupData {
  date: string;
  screenings: (Selection & { conflicts?: ConflictInfo[] })[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  selections,
  onRemoveScreening,
  onExport,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  // Group selections by date and detect conflicts
  const dateGroups: DateGroupData[] = useMemo(() => {
    if (selections.length === 0) return [];

    // Sort by datetime
    const sorted = [...selections].sort((a, b) =>
      new Date(a.screening_snapshot.datetime).getTime() - new Date(b.screening_snapshot.datetime).getTime()
    );

    // Group by date
    const groups: Map<string, Selection[]> = new Map();
    sorted.forEach((selection) => {
      const date = format(new Date(selection.screening_snapshot.datetime), 'yyyy-MM-dd');
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(selection);
    });

    // Detect conflicts within each date group
    const groupsWithConflicts: DateGroupData[] = [];
    groups.forEach((screenings, date) => {
      const screeningsWithConflicts = screenings.map((screening, idx) => {
        const conflicts: ConflictInfo[] = [];
        const startTime = new Date(screening.screening_snapshot.datetime);
        const endTime = new Date(startTime.getTime() + screening.screening_snapshot.duration_minutes * 60000);

        // Check against other screenings in the same date
        for (let i = 0; i < screenings.length; i++) {
          if (i === idx) continue;

          const otherScreening = screenings[i];
          const otherStartTime = new Date(otherScreening.screening_snapshot.datetime);
          const otherEndTime = new Date(otherStartTime.getTime() + otherScreening.screening_snapshot.duration_minutes * 60000);

          // Check for overlap
          const overlap = Math.max(0,
            Math.min(endTime.getTime(), otherEndTime.getTime()) - Math.max(startTime.getTime(), otherStartTime.getTime())
          );

          if (overlap > 0) {
            // Impossible conflict - true overlap
            const overlapMinutes = Math.round(overlap / 60000);
            conflicts.push({
              severity: 'impossible',
              screening_ids: [screening.screening_id, otherScreening.screening_id],
              overlap_minutes: overlapMinutes,
              message_tc: `與另一場次重疊 ${overlapMinutes} 分鐘`,
              message_en: `Overlaps ${overlapMinutes} minutes with another screening`,
            });
          } else {
            // Check for tight timing between different venues
            const gap = Math.abs(startTime.getTime() - otherEndTime.getTime()) / 60000;
            const samevenue = screening.venue_snapshot.id === otherScreening.venue_snapshot.id;

            if (!samevenue && gap < 30) {
              conflicts.push({
                severity: 'warning',
                screening_ids: [screening.screening_id, otherScreening.screening_id],
                overlap_minutes: 0,
                message_tc: `與另一場次間隔少於30分鐘，且在不同場地`,
                message_en: `Less than 30 minutes between screenings at different venues`,
              });
            }
          }
        }

        return {
          ...screening,
          conflicts: conflicts.length > 0 ? conflicts : undefined,
        };
      });

      groupsWithConflicts.push({
        date,
        screenings: screeningsWithConflicts,
      });
    });

    return groupsWithConflicts;
  }, [selections]);

  if (selections.length === 0) {
    return (
      <div data-testid="schedule-view" className="bg-white rounded-lg shadow-md p-8">
        <div data-testid="schedule-empty-state" className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isZh ? '沒有已選場次' : 'No screenings selected'}
          </h3>
          <p className="text-gray-500">
            {isZh ? '選擇電影場次來建立您的觀影時間表' : 'Select film screenings to build your schedule'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="schedule-view" className="bg-white rounded-lg shadow-md">
      {/* Header with Export Button */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isZh ? '我的觀影時間表' : 'My Schedule'}
        </h2>
        <button
          data-testid="export-btn"
          onClick={onExport}
          aria-label={isZh ? '匯出我的觀影時間表為 Markdown' : 'Export my schedule as Markdown'}
          className="min-h-[44px] px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isZh ? '匯出 Markdown' : 'Export Markdown'}
        </button>
      </div>

      {/* Date Groups */}
      <div className="p-6 space-y-6">
        {dateGroups.map((group) => (
          <DateGroupComponent
            key={group.date}
            date={group.date}
            screenings={group.screenings}
            onRemoveScreening={onRemoveScreening}
          />
        ))}
      </div>
    </div>
  );
};
