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
      <div data-testid="schedule-view" className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl shadow-lg p-12">
        <div data-testid="schedule-empty-state" className="text-center max-w-md mx-auto space-y-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {isZh ? '開始規劃您的電影之旅' : 'Start Planning Your Film Journey'}
              </h3>

              <p className="text-muted-foreground leading-relaxed text-lg">
                {isZh
                  ? '瀏覽影片目錄，選擇您喜愛的場次，建立專屬的觀影時間表'
                  : 'Browse the catalogue, select your favorite screenings, and build your personalized schedule'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-muted-foreground" />
            <span>{isZh ? '或' : 'or'}</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-muted-foreground" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="font-semibold text-primary mb-1">
                {isZh ? '🎬 探索' : '🎬 Explore'}
              </div>
              <p className="text-xs text-muted-foreground">
                {isZh ? '瀏覽豐富的電影選擇' : 'Browse film selection'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
              <div className="font-semibold text-secondary mb-1">
                {isZh ? '⏰ 安排' : '⏰ Schedule'}
              </div>
              <p className="text-xs text-muted-foreground">
                {isZh ? '規劃您的觀影時間' : 'Plan your screenings'}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="w-full px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {isZh ? '返回瀏覽電影' : 'Browse Films'}
          </button>
        </div>
      </div>
    );
  }

  const totalDays = dateGroups.length;
  const totalScreenings = selections.length;
  const conflicts = selections.filter(s => {
    const group = dateGroups.find(g =>
      g.screenings.find(sc => sc.screening_id === s.screening_id && sc.conflicts)
    );
    return !!group;
  }).length;

  return (
    <div data-testid="schedule-view" className="bg-card rounded-2xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-8 border-b border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3">
              {isZh ? '我的觀影時間表' : 'My Schedule'}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  {totalScreenings} {isZh ? '場次' : 'screenings'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-muted-foreground">
                  {totalDays} {isZh ? '天' : 'days'}
                </span>
              </div>
              {conflicts > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-muted-foreground">
                    {conflicts} {isZh ? '個衝突' : 'conflicts'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            data-testid="export-btn"
            onClick={onExport}
            aria-label={isZh ? '匯出我的觀影時間表為 Markdown' : 'Export my schedule as Markdown'}
            className="group relative min-h-[52px] px-8 py-3 bg-gradient-to-br from-secondary via-secondary to-accent text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 focus:ring-4 focus:ring-secondary/50 focus:ring-offset-2 transition-all duration-300 overflow-hidden flex items-center gap-2 whitespace-nowrap"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="relative z-10">{isZh ? '匯出 Markdown' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* Date Groups */}
      <div className="p-8 space-y-8">
        {dateGroups.map((group, index) => (
          <div key={group.date}>
            <DateGroupComponent
              date={group.date}
              screenings={group.screenings}
              onRemoveScreening={onRemoveScreening}
            />
            {index < dateGroups.length - 1 && (
              <div className="mt-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
