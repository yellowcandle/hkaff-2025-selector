import { useState } from 'react';
import { Film, Screening } from '../types/film';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Clock, MapPin, Calendar, AlertTriangle } from 'lucide-react';

interface ScheduleViewProps {
  selectedFilms: Film[];
}

interface ScheduleItem {
  film: Film;
  screening: Screening;
}

export function ScheduleView({ selectedFilms }: ScheduleViewProps) {
  const [selectedDate, setSelectedDate] = useState<string>('all');

  // Get all dates from selected films
  const allDates = Array.from(
    new Set(
      selectedFilms.flatMap(f => f.screenings.map(s => s.date))
    )
  ).sort();

  // Build schedule items
  const scheduleItems: ScheduleItem[] = selectedFilms.flatMap(film =>
    film.screenings.map(screening => ({ film, screening }))
  );

  // Filter by selected date
  const filteredItems = selectedDate === 'all'
    ? scheduleItems
    : scheduleItems.filter(item => item.screening.date === selectedDate);

  // Group by date
  const itemsByDate = filteredItems.reduce((acc, item) => {
    const date = item.screening.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  // Sort items within each date by time
  Object.keys(itemsByDate).forEach(date => {
    itemsByDate[date].sort((a, b) => a.screening.time.localeCompare(b.screening.time));
  });

  // Detect conflicts
  const detectConflicts = (items: ScheduleItem[]) => {
    const conflicts: Set<string> = new Set();
    
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const item1 = items[i];
        const item2 = items[j];
        
        if (item1.screening.date === item2.screening.date) {
          const time1 = parseTime(item1.screening.time);
          const time2 = parseTime(item2.screening.time);
          const end1 = time1 + item1.film.runtime;
          const end2 = time2 + item2.film.runtime;
          
          // Check if times overlap (with 15min buffer for travel)
          if ((time1 < end2 + 15 && end1 + 15 > time2)) {
            conflicts.add(item1.screening.id);
            conflicts.add(item2.screening.id);
          }
        }
      }
    }
    
    return conflicts;
  };

  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr: string, runtime: number) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + runtime;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    return `${timeStr} - ${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
  };

  const allConflicts = detectConflicts(scheduleItems);
  const hasConflicts = allConflicts.size > 0;

  if (selectedFilms.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">
          No films selected yet. Browse films and add them to your selection to build your schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2>Your Festival Schedule</h2>
          <p className="text-gray-600">
            {selectedFilms.length} films selected • {scheduleItems.length} total screenings
          </p>
        </div>

        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            {allDates.map((date) => (
              <SelectItem key={date} value={date}>
                {formatDate(date)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasConflicts && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have scheduling conflicts! Some screenings overlap or don't allow enough time for travel between venues.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {Object.entries(itemsByDate)
          .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
          .map(([date, items]) => {
            const dateConflicts = detectConflicts(items);
            
            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3>{formatDate(date)}</h3>
                  <Badge variant="secondary">
                    {items.length} screenings
                  </Badge>
                </div>

                <div className="space-y-3">
                  {items.map((item) => {
                    const hasConflict = dateConflicts.has(item.screening.id);
                    
                    return (
                      <Card 
                        key={item.screening.id}
                        className={hasConflict ? 'border-red-300 bg-red-50' : ''}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="mb-1">
                                {item.film.title}
                              </CardTitle>
                              <p className="text-gray-600">
                                {item.film.director}
                              </p>
                            </div>
                            {hasConflict && (
                              <Badge variant="destructive">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Conflict
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid sm:grid-cols-3 gap-3 text-gray-700">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              <span>{formatTime(item.screening.time, item.film.runtime)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              <span>{item.screening.venue}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.film.genre.map((genre) => (
                                <Badge key={genre} variant="outline" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
