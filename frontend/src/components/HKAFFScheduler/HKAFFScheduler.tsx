import React, { useState, useMemo } from 'react';
import { Calendar, Film as FilmIcon, X, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import type { Film, Category, Venue, Screening, FilmWithScreenings, Selection } from '../../types';
import type { UserSelection } from '../../../../specs/001-given-this-film/contracts/service-interfaces';
import { storageService } from '../../services/storageService';
import { useToast } from '../Toast/Toast';
import { FilmCard } from './FilmCard';
import { ScheduleView } from '../ScheduleView/ScheduleView';

interface HKAFFSchedulerProps {
  films: Film[];
  screenings: Screening[];
  venues: Venue[];
  categories: Category[];
  onNavigateToCatalogue?: () => void;
}

interface ScreeningWithDetails {
  id: string;
  title: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  duration: number;
  director: string;
  country: string;
  language: string;
  description: string;
  film: Film;
  screening: Screening;
}

export default function HKAFFScheduler({ films, screenings, venues, categories, onNavigateToCatalogue }: HKAFFSchedulerProps) {
  const { i18n } = useTranslation();
  const { showToast } = useToast();
  const isZh = i18n.language === 'tc';

  // State
  const [selectedScreenings, setSelectedScreenings] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVenue, setFilterVenue] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [view, setView] = useState<'browse' | 'schedule'>('browse');
  const [selectedFilm, setSelectedFilm] = useState<ScreeningWithDetails | null>(null);

  // Transform screenings data to include film details
  const screeningsWithDetails = useMemo((): ScreeningWithDetails[] => {
    return screenings.map(screening => {
      const film = films.find(f => f.id === screening.film_id);
      const venue = venues.find(v => v.id === screening.venue_id);
      const category = categories.find(c => c.id === film?.category_id);

      // Log missing data for debugging
      if (!film) {
        console.warn(`Film not found for screening ${screening.id}, film_id: ${screening.film_id}`);
        return null;
      }
      if (!venue) {
        console.warn(`Venue not found for screening ${screening.id}, venue_id: ${screening.venue_id}`);
        return null;
      }
      if (!category) {
        console.warn(`Category not found for film ${film.id}, category_id: ${film.category_id}`);
        return null;
      }

      const screeningDate = new Date(screening.datetime);
      const dateStr = screeningDate.toISOString().split('T')[0];
      const timeStr = screeningDate.toTimeString().slice(0, 5);

      return {
        id: screening.id,
        title: isZh ? film.title_tc : film.title_en,
        category: isZh ? category.name_tc : category.name_en,
        venue: isZh ? venue.name_tc : venue.name_en,
        date: dateStr,
        time: timeStr,
        duration: screening.duration_minutes,
        director: film.director,
        country: film.country,
        language: screening.language,
        description: isZh ? film.synopsis_tc : film.synopsis_en,
        film,
        screening
      };
    }).filter(Boolean) as ScreeningWithDetails[];
  }, [screenings, films, venues, categories, isZh]);

  // Get unique values for filters
  const uniqueCategories = useMemo(() => {
    return [...new Set(screeningsWithDetails.map(s => s.category))];
  }, [screeningsWithDetails]);

  const uniqueVenues = useMemo(() => {
    return [...new Set(screeningsWithDetails.map(s => s.venue))];
  }, [screeningsWithDetails]);

  const uniqueDates = useMemo(() => {
    return [...new Set(screeningsWithDetails.map(s => s.date))].sort();
  }, [screeningsWithDetails]);

  // Group screenings by film
  const filmsWithScreenings = useMemo((): FilmWithScreenings[] => {
    const filmMap = new Map<string, FilmWithScreenings>();
    
    screeningsWithDetails.forEach(screening => {
      const filmId = screening.film.id;
      
      if (!filmMap.has(filmId)) {
        const category = categories.find(c => c.id === screening.film.category_id)!;
        filmMap.set(filmId, {
          film: screening.film,
          screenings: [],
          category
        });
      }
      
      filmMap.get(filmId)!.screenings.push(screening.screening);
    });
    
    return Array.from(filmMap.values());
  }, [screeningsWithDetails, categories]);

  // Filter films based on their screenings
  const filteredFilms = useMemo(() => {
    return filmsWithScreenings.filter(filmWithScreenings => {
      // Filter by category
      if (filterCategory !== 'all') {
        const categoryMatch = isZh 
          ? filmWithScreenings.category.name_tc === filterCategory
          : filmWithScreenings.category.name_en === filterCategory;
        if (!categoryMatch) return false;
      }
      
      // Check if film has at least one screening matching venue/date filters
      const hasMatchingScreening = filmWithScreenings.screenings.some(screening => {
        const screeningData = screeningsWithDetails.find(s => s.id === screening.id);
        if (!screeningData) return false;
        
        if (filterVenue !== 'all' && screeningData.venue !== filterVenue) return false;
        if (filterDate !== 'all' && screeningData.date !== filterDate) return false;
        return true;
      });
      
      return hasMatchingScreening;
    });
  }, [filmsWithScreenings, filterCategory, filterVenue, filterDate, screeningsWithDetails, isZh]);

  // Load existing selections from storage
  React.useEffect(() => {
    const existingSelections = storageService.getSelections();
    const selectionIds = existingSelections.map(s => s.screening_id);
    setSelectedScreenings(selectionIds);
  }, []);

  // Toggle screening selection
  const toggleScreening = (screeningId: string) => {
    const screening = screeningsWithDetails.find(s => s.id === screeningId);
    if (!screening) return;

    try {
      if (selectedScreenings.includes(screeningId)) {
        // Remove selection
        storageService.removeSelection(screeningId);
        setSelectedScreenings(prev => prev.filter(id => id !== screeningId));
        showToast(
          isZh ? '已移除場次' : 'Screening removed',
          'info'
        );
      } else {
        // Add selection
        const venue = venues.find(v => v.id === screening.screening.venue_id);
        if (!venue) {
          throw new Error('Venue not found');
        }
        storageService.addSelection(screening.screening, screening.film, venue);
        setSelectedScreenings(prev => [...prev, screeningId]);
        showToast(
          isZh ? '已加入場次' : 'Screening added',
          'success'
        );
      }
    } catch (err) {
      console.error('Failed to toggle screening:', err);
      showToast(
        isZh ? '操作失敗，請重試' : 'Operation failed, please try again',
        'error'
      );
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'MMM d, EEE');
  };

  // Format time helper
  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  // Convert UserSelection[] to Selection[] for ScheduleView
  const convertToSelections = (userSelections: UserSelection[]): Selection[] => {
    return userSelections.map(us => {
      const film = films.find(f => f.id === us.film_snapshot.id);
      const screening = screenings.find(s => s.id === us.screening_snapshot.id);
      const venue = venues.find(v => 
        v.name_tc === us.screening_snapshot.venue_name_tc && 
        v.name_en === us.screening_snapshot.venue_name_en
      );

      return {
        screening_id: us.screening_id,
        added_at: us.added_at,
        film_snapshot: film || {
          id: us.film_snapshot.id,
          title_tc: us.film_snapshot.title_tc,
          title_en: us.film_snapshot.title_en,
          category_id: '',
          synopsis_tc: '',
          synopsis_en: '',
          runtime_minutes: us.screening_snapshot.duration_minutes,
          director: '',
          country: '',
          poster_url: us.film_snapshot.poster_url || '',
          detail_url_tc: '',
          detail_url_en: ''
        },
        screening_snapshot: screening || {
          id: us.screening_snapshot.id,
          film_id: us.film_snapshot.id,
          venue_id: venue?.id || '',
          datetime: us.screening_snapshot.datetime,
          duration_minutes: us.screening_snapshot.duration_minutes,
          language: ''
        },
        venue_snapshot: venue || {
          id: '',
          name_tc: us.screening_snapshot.venue_name_tc,
          name_en: us.screening_snapshot.venue_name_en
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {isZh ? '香港亞洲電影節 2025' : 'HKAFF 2025'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {isZh ? `${films.length} 部電影 • ${screenings.length} 場放映` : `${films.length} Films • ${screenings.length} Screenings`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToCatalogue ? onNavigateToCatalogue() : setView('browse')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-150 ${
                  view === 'browse'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FilmIcon className="inline mr-2 w-4 h-4" />
                {isZh ? '瀏覽電影' : 'Browse Films'}
              </button>
              <button
                onClick={() => setView('schedule')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-150 relative ${
                  view === 'schedule'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Calendar className="inline mr-2 w-4 h-4" />
                {isZh ? '我的時間表' : 'My Schedule'}
                {selectedScreenings.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center">
                    {selectedScreenings.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {view === 'browse' ? (
          <>
            {/* Filters */}
            <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-white">
                {isZh ? '篩選場次' : 'Filter Screenings'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {isZh ? '類別' : 'Category'}
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">{isZh ? '所有類別' : 'All Categories'}</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {isZh ? '場地' : 'Venue'}
                  </label>
                  <select
                    value={filterVenue}
                    onChange={(e) => setFilterVenue(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">{isZh ? '所有場地' : 'All Venues'}</option>
                    {uniqueVenues.map(venue => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {isZh ? '日期' : 'Date'}
                  </label>
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">{isZh ? '所有日期' : 'All Dates'}</option>
                    {uniqueDates.map(date => (
                      <option key={date} value={date}>{formatDate(date)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Films Grid */}
            <div className="mb-4 text-gray-400 text-sm">
              {isZh ? `顯示 ${filteredFilms.length} 部電影` : `Showing ${filteredFilms.length} of ${films.length} films`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFilms.map(filmWithScreenings => (
                <FilmCard
                  key={filmWithScreenings.film.id}
                  film={filmWithScreenings}
                  selectedScreenings={selectedScreenings}
                  existingSelections={storageService.getSelections()}
                  onToggleScreening={toggleScreening}
                  onShowDetails={(filmId) => {
                    const screening = screeningsWithDetails.find(s => s.film.id === filmId);
                    if (screening) setSelectedFilm(screening);
                  }}
                  getVenueById={(venueId) => venues.find(v => v.id === venueId)}
                />
              ))}
            </div>

            {filteredFilms.length === 0 && (
              <div className="text-center py-16 bg-gray-900 rounded-lg shadow-md border border-gray-800">
                <FilmIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-xl text-gray-400">
                  {isZh ? '沒有符合篩選條件的電影' : 'No films match your filters'}
                </p>
              </div>
            )}
          </>
        ) : (
          <ScheduleView
            selections={convertToSelections(storageService.getSelections())}
            onRemove={toggleScreening}
            onNavigateToCatalogue={() => setView('browse')}
          />
        )}
      </div>

      {/* Film Detail Modal */}
      {selectedFilm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="film-detail-title"
        >
          <button
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSelectedFilm(null)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSelectedFilm(null);
              }
            }}
            aria-label={isZh ? '關閉' : 'Close'}
          />
          <div
            className="relative bg-gray-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            {selectedFilm.film.poster_url && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={selectedFilm.film.poster_url}
                  alt={selectedFilm.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {selectedFilm.category}
                </span>
                <h2 id="film-detail-title" className="text-3xl font-bold mt-3 text-white">{selectedFilm.title}</h2>
                {selectedFilm.director && (
                  <p className="text-lg text-gray-400 mt-1">{selectedFilm.director}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedFilm(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-card-foreground mb-6 leading-relaxed">{selectedFilm.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">
                  {isZh ? '日期與時間' : 'Date & Time'}
                </div>
                <div className="font-semibold text-white">
                  {formatDate(selectedFilm.date)}<br />
                  {formatTime(selectedFilm.time)}
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">
                  {isZh ? '場地' : 'Venue'}
                </div>
                <div className="font-semibold text-white">{selectedFilm.venue}</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">
                  {isZh ? '片長' : 'Duration'}
                </div>
                <div className="font-semibold text-white">{selectedFilm.duration} {isZh ? '分鐘' : 'minutes'}</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">
                  {isZh ? '語言' : 'Language'}
                </div>
                <div className="font-semibold text-white">{selectedFilm.language || (isZh ? '未指定' : 'Not specified')}</div>
              </div>
            </div>

            <button
              onClick={() => {
                toggleScreening(selectedFilm.id);
                setSelectedFilm(null);
              }}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors duration-150 ${
                selectedScreenings.includes(selectedFilm.id)
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
              }`}
            >
              {selectedScreenings.includes(selectedFilm.id) ? (
                <>
                  <Heart className="inline mr-2 w-5 h-5 fill-current" />
                  {isZh ? '從時間表移除' : 'Remove from Schedule'}
                </>
              ) : (
                <>
                  <Heart className="inline mr-2 w-5 h-5" />
                  {isZh ? '加入時間表' : 'Add to Schedule'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
