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
      <div data-testid="schedule-view" className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl p-12 border border-gray-100">
        <div data-testid="schedule-empty-state" className="text-center max-w-2xl mx-auto space-y-10">
          <div className="flex flex-col items-center gap-8">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center shadow-2xl animate-pulse">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 rounded-full border-2 border-secondary/20 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            </div>

            <div className="space-y-4">
              <h3 className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {isZh ? '開始規劃您的電影之旅' : 'Start Planning Your Film Journey'}
              </h3>

              <p className="text-gray-600 leading-relaxed text-lg max-w-xl mx-auto">
                {isZh
                  ? '瀏覽影片目錄，選擇您喜愛的場次，建立專屬的觀影時間表。我們會自動為您檢測時間衝突！'
                  : 'Browse the catalogue, select your favorite screenings, and build your personalized schedule. We\'ll automatically detect conflicts for you!'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="font-semibold">{isZh ? '快速開始' : 'Quick Start'}</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-3">🎬</div>
              <div className="font-bold text-primary mb-2 text-base">
                {isZh ? '探索電影' : 'Explore Films'}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isZh ? '瀏覽豐富的電影選擇，發現精彩作品' : 'Browse our rich film selection and discover great works'}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-3">⏰</div>
              <div className="font-bold text-secondary mb-2 text-base">
                {isZh ? '選擇場次' : 'Pick Screenings'}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isZh ? '選擇最適合您的放映時間和場地' : 'Choose the best screening times and venues for you'}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-3">✨</div>
              <div className="font-bold text-accent mb-2 text-base">
                {isZh ? '自動檢測' : 'Auto-Detect'}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isZh ? '系統自動檢測時間衝突，輕鬆規劃' : 'System automatically detects conflicts for easy planning'}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group mx-auto"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>{isZh ? '返回瀏覽電影' : 'Browse Films'}</span>
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
    <div data-testid="schedule-view" className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-4">
            <h2 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {isZh ? '我的觀影時間表' : 'My Schedule'}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-gray-700 font-semibold">
                  {totalScreenings} {isZh ? '場次' : 'screenings'}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="text-gray-700 font-semibold">
                  {totalDays} {isZh ? '天' : 'days'}
                </span>
              </div>
              {conflicts > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full shadow-sm border border-destructive/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                  <span className="text-destructive font-bold">
                    ⚠️ {conflicts} {isZh ? '個衝突' : 'conflicts'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            data-testid="export-btn"
            onClick={onExport}
            aria-label={isZh ? '匯出我的觀影時間表為 Markdown' : 'Export my schedule as Markdown'}
            className="group relative min-h-[56px] px-10 py-4 bg-gradient-to-br from-secondary via-secondary to-accent text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 focus:ring-4 focus:ring-secondary/50 focus:ring-offset-2 transition-all duration-300 overflow-hidden flex items-center gap-3 whitespace-nowrap"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="relative z-10 text-lg">{isZh ? '匯出 Markdown' : 'Export'}</span>
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
