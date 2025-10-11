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
  const isZh = i18n.language === 'tc';

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
            const sameVenue = screening.venue_snapshot.id === otherScreening.venue_snapshot.id;

            if (!sameVenue && gap < 30) {
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
      <div data-testid="schedule-view" className="bg-card rounded-xl shadow-lg p-12">
        <div data-testid="schedule-empty-state" className="text-center max-w-md mx-auto space-y-6">
          {/* Illustration - Larger, colorful icon with gradient background */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          {/* Heading */}
          <h3 className="text-2xl font-bold text-foreground">
            {isZh ? '開始規劃您的電影之旅' : 'Start Planning Your Film Journey'}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {isZh 
              ? '瀏覽影片目錄，選擇您喜愛的場次，建立專屬的觀影時間表' 
              : 'Browse the catalogue, select your favorite screenings, and build your personalized schedule'
            }
          </p>
          
          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary 
                         text-white font-semibold rounded-xl shadow-lg
                         hover:shadow-xl hover:scale-105
                         transition-all duration-200
                         focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              {isZh ? '探索電影' : 'Explore Films'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="schedule-view" className="bg-card rounded-xl shadow-md">
      {/* Header with Export Button */}
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">
          {isZh ? '我的觀影時間表' : 'My Schedule'}
        </h2>
        <button
          data-testid="export-btn"
          onClick={onExport}
          aria-label={isZh ? '匯出我的觀影時間表為 Markdown' : 'Export my schedule as Markdown'}
          className="group relative min-h-[48px] px-7 py-3 bg-gradient-to-br from-secondary via-secondary to-accent text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 focus:ring-4 focus:ring-secondary/50 focus:ring-offset-2 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isZh ? '匯出 Markdown' : 'Export Markdown'}
          </div>
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
