import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Selection, ConflictInfo } from '../../types';
import { CalendarView } from './CalendarView';
import { conflictDetector } from '../../services/conflictDetector';
import type { UserSelection } from '../../../../specs/001-given-this-film/contracts/service-interfaces';

interface ScheduleViewProps {
  selections: Selection[];
  onRemove: (screeningId: string) => void;
  onNavigateToCatalogue: () => void;
}

// Export these types for CalendarView
export type { Selection, ConflictInfo };

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  selections,
  onRemove,
  onNavigateToCatalogue,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';

  // Detect conflicts and create conflict map
  const conflictsByScreeningId = useMemo(() => {
    if (selections.length === 0) return new Map<string, ConflictInfo[]>();

    // Convert Selection[] to UserSelection[] for conflictDetector
    const userSelections: UserSelection[] = selections.map(selection => ({
      screening_id: selection.screening_id,
      added_at: selection.added_at,
      film_snapshot: {
        id: selection.film_snapshot.id,
        title_tc: selection.film_snapshot.title_tc,
        title_en: selection.film_snapshot.title_en,
        poster_url: selection.film_snapshot.poster_url
      },
      screening_snapshot: {
        id: selection.screening_snapshot.id,
        datetime: selection.screening_snapshot.datetime,
        duration_minutes: selection.screening_snapshot.duration_minutes,
        venue_name_tc: selection.venue_snapshot.name_tc,
        venue_name_en: selection.venue_snapshot.name_en
      }
    }));

    // Detect conflicts using the conflictDetector service
    const allConflicts = conflictDetector.detectConflicts(userSelections);

    // Group conflicts by screening ID for easy lookup
    const conflictMap = new Map<string, ConflictInfo[]>();
    allConflicts.forEach(conflict => {
      // Convert service Conflict to component ConflictInfo
      const conflictInfo: ConflictInfo = {
        severity: conflict.severity,
        screening_ids: [conflict.screening_a.screening_id, conflict.screening_b.screening_id],
        overlap_minutes: conflict.overlap_minutes,
        message_tc: conflict.severity === 'impossible'
          ? `與另一場次重疊 ${conflict.overlap_minutes} 分鐘`
          : `與另一場次間隔少於30分鐘，且在不同場地`,
        message_en: conflict.severity === 'impossible'
          ? `Overlaps ${conflict.overlap_minutes} minutes with another screening`
          : `Less than 30 minutes between screenings at different venues`,
      };

      // Add conflict to both screenings involved
      if (!conflictMap.has(conflict.screening_a.screening_id)) {
        conflictMap.set(conflict.screening_a.screening_id, []);
      }
      conflictMap.get(conflict.screening_a.screening_id)!.push(conflictInfo);

      if (!conflictMap.has(conflict.screening_b.screening_id)) {
        conflictMap.set(conflict.screening_b.screening_id, []);
      }
      conflictMap.get(conflict.screening_b.screening_id)!.push(conflictInfo);
    });

    return conflictMap;
  }, [selections]);

  if (selections.length === 0) {
    return (
      <div data-testid="schedule-view" className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl p-12 border border-gray-100">
        <div data-testid="schedule-empty-state" className="text-center max-w-2xl mx-auto space-y-10">
          <div className="flex flex-col items-center gap-8">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {/* Decorative rings - removed animations for performance */}
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
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-shadow duration-150 hover:-translate-y-0.5">
              <div className="text-4xl mb-3">🎬</div>
              <div className="font-bold text-primary mb-2 text-base">
                {isZh ? '探索電影' : 'Explore Films'}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isZh ? '瀏覽豐富的電影選擇，發現精彩作品' : 'Browse our rich film selection and discover great works'}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 hover:shadow-lg transition-shadow duration-150 hover:-translate-y-0.5">
              <div className="text-4xl mb-3">⏰</div>
              <div className="font-bold text-secondary mb-2 text-base">
                {isZh ? '選擇場次' : 'Pick Screenings'}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isZh ? '選擇最適合您的放映時間和場地' : 'Choose the best screening times and venues for you'}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 hover:shadow-lg transition-shadow duration-150 hover:-translate-y-0.5">
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
            onClick={onNavigateToCatalogue}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-shadow transition-transform duration-150 flex items-center justify-center gap-3 group mx-auto"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>{isZh ? '返回瀏覽電影' : 'Browse Films'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalScreenings = selections.length;
  const totalConflicts = Array.from(conflictsByScreeningId.values()).reduce(
    (sum, conflicts) => sum + conflicts.length, 
    0
  ) / 2; // Divide by 2 because each conflict is counted twice

  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    selections.forEach(selection => {
      const date = format(new Date(selection.screening_snapshot.datetime), 'yyyy-MM-dd');
      dates.add(date);
    });
    return dates.size;
  }, [selections]);

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
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-gray-700 font-semibold">
                  {totalScreenings} {isZh ? '場次' : 'screenings'}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="text-gray-700 font-semibold">
                  {uniqueDates} {isZh ? '天' : 'days'}
                </span>
              </div>
              {totalConflicts > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full shadow-sm border border-destructive/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  <span className="text-destructive font-bold">
                    ⚠️ {totalConflicts} {isZh ? '個衝突' : 'conflicts'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="p-8">
        <CalendarView
          selections={selections}
          conflicts={conflictsByScreeningId}
          onRemove={onRemove}
          isZh={isZh}
        />
      </div>
    </div>
  );
};
