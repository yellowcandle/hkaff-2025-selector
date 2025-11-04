import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { Clock, MapPin, X, AlertTriangle } from 'lucide-react';
import type { Selection, ConflictInfo } from '../ScheduleView/ScheduleView';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
  selections: Selection[];
  conflicts: Map<string, ConflictInfo[]>;
  onRemove: (screeningId: string) => void;
  isZh: boolean;
}

export function CalendarView({ selections, conflicts, onRemove, isZh }: CalendarViewProps) {
  const { t } = useTranslation();

  // Festival date range
  const minDate = new Date(2025, 9, 22); // Oct 22, 2025
  const maxDate = new Date(2025, 10, 9); // Nov 9, 2025

  // Group selections by date
  const selectionsByDate = useMemo(() => {
    const grouped = new Map<string, Selection[]>();
    
    selections.forEach(selection => {
      const dateStr = format(new Date(selection.screening_snapshot.datetime), 'yyyy-MM-dd');
      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, []);
      }
      grouped.get(dateStr)!.push(selection);
    });

    // Sort screenings within each date by time
    grouped.forEach((screenings) => {
      screenings.sort((a, b) => 
        new Date(a.screening_snapshot.datetime).getTime() - 
        new Date(b.screening_snapshot.datetime).getTime()
      );
    });

    return grouped;
  }, [selections]);

  // Check if a date has screenings
  const hasScreenings = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return selectionsByDate.has(dateStr);
  };

  // Check if a date has conflicts
  const hasConflicts = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dateScreenings = selectionsByDate.get(dateStr) || [];
    return dateScreenings.some(screening => 
      conflicts.has(screening.screening_id) && 
      conflicts.get(screening.screening_id)!.length > 0
    );
  };

  // Custom tile content
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const dateScreenings = selectionsByDate.get(dateStr) || [];
    
    if (dateScreenings.length === 0) return null;

    return (
      <div className="flex justify-center mt-1">
        <div className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-blue-600 text-white rounded-full text-xs font-semibold">
          {dateScreenings.length}
        </div>
      </div>
    );
  };

  // Custom tile class name
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    const classes = [];
    
    if (hasScreenings(date)) {
      classes.push('bg-blue-50 font-semibold');
    }
    
    if (hasConflicts(date)) {
      classes.push('!bg-orange-50 !border-2 !border-orange-500');
    }
    
    return classes.join(' ');
  };

  // State for selected date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get screenings for selected date
  const selectedDateScreenings = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return selectionsByDate.get(dateStr) || [];
  }, [selectedDate, selectionsByDate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Calendar
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as Date)}
          minDate={minDate}
          maxDate={maxDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          locale={isZh ? 'zh-HK' : 'en-US'}
          className="w-full border-none font-sans"
        />
      </div>

      {selectedDate && selectedDateScreenings.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md max-h-[600px] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
            {format(selectedDate, isZh ? 'M月d日 EEEE' : 'EEEE, MMMM d')}
          </h3>
          
          <div className="space-y-4">
            {selectedDateScreenings.map(selection => {
              const screeningConflicts = conflicts.get(selection.screening_id) || [];
              const hasConflict = screeningConflicts.length > 0;
              
              return (
                <div
                  key={selection.screening_id}
                  className={`p-4 rounded-lg border transition-all ${
                    hasConflict 
                      ? 'bg-orange-50 border-orange-500' 
                      : 'bg-gray-50 border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-semibold text-gray-900 flex-1">
                      {isZh 
                        ? selection.film_snapshot.title_tc 
                        : selection.film_snapshot.title_en}
                    </h4>
                    <button
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => onRemove(selection.screening_id)}
                      aria-label={t('screening.remove')}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{format(new Date(selection.screening_snapshot.datetime), 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      <span className="line-clamp-1">
                        {isZh 
                          ? selection.venue_snapshot.name_tc 
                          : selection.venue_snapshot.name_en}
                      </span>
                    </div>
                    <div>
                      <span>{selection.screening_snapshot.duration_minutes} {isZh ? '分鐘' : 'min'}</span>
                    </div>
                  </div>

                  {hasConflict && (
                    <div className="flex items-center gap-2 mt-3 p-2 bg-orange-100 rounded">
                      <AlertTriangle size={14} className="text-orange-700 flex-shrink-0" />
                      <span className="text-xs text-orange-900 font-medium">
                        {screeningConflicts[0].severity === 'impossible'
                          ? (isZh ? '與其他場次時間重疊' : 'Overlaps with another screening')
                          : (isZh ? '換場時間緊迫' : 'Tight timing between screenings')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!selectedDate && selections.length > 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">
            {isZh ? '點擊日期查看當日場次' : 'Click a date to view screenings'}
          </p>
        </div>
      )}
    </div>
  );
}
