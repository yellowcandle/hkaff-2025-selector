import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Film, Heart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

// Import existing types and services
import type { Film, Category, Venue, Screening } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../Toast/Toast';

interface HKAFFSchedulerProps {
  films: Film[];
  screenings: Screening[];
  venues: Venue[];
  categories: Category[];
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

export default function HKAFFScheduler({ films, screenings, venues, categories }: HKAFFSchedulerProps) {
  const { t, i18n } = useTranslation();
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

      if (!film || !venue || !category) return null;

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

  // Filter screenings
  const filteredScreenings = useMemo(() => {
    return screeningsWithDetails.filter(screening => {
      if (filterCategory !== 'all' && screening.category !== filterCategory) return false;
      if (filterVenue !== 'all' && screening.venue !== filterVenue) return false;
      if (filterDate !== 'all' && screening.date !== filterDate) return false;
      return true;
    });
  }, [screeningsWithDetails, filterCategory, filterVenue, filterDate]);

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
        storageService.addSelection(screening.screening, screening.film, screening.venue);
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

  // Get my schedule
  const mySchedule = useMemo(() => {
    const selected = screeningsWithDetails.filter(s => selectedScreenings.includes(s.id));
    return selected.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }, [screeningsWithDetails, selectedScreenings]);

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'MMM d, EEE');
  };

  // Format time
  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                HKAFF 2025
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                {isZh ? '香港亞洲電影節 • 10月22日 - 11月9日' : 'Hong Kong Asian Film Festival • Oct 22 - Nov 9'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('browse')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  view === 'browse'
                    ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Film className="inline mr-2 w-4 h-4" />
                {isZh ? '瀏覽電影' : 'Browse Films'}
              </button>
              <button
                onClick={() => setView('schedule')}
                className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                  view === 'schedule'
                    ? 'bg-pink-600 shadow-lg shadow-pink-500/50'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Calendar className="inline mr-2 w-4 h-4" />
                {isZh ? '我的時間表' : 'My Schedule'}
                {selectedScreenings.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
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
            <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-500/30">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-600 w-1 h-6 mr-3"></span>
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">{isZh ? '所有日期' : 'All Dates'}</option>
                    {uniqueDates.map(date => (
                      <option key={date} value={date}>{formatDate(date)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Screenings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScreenings.map(screening => {
                const isSelected = selectedScreenings.includes(screening.id);
                return (
                  <div
                    key={screening.id}
                    className={`bg-black bg-opacity-40 backdrop-blur-sm rounded-xl overflow-hidden border-2 transition-all hover:shadow-xl hover:shadow-purple-500/30 cursor-pointer ${
                      isSelected ? 'border-pink-500 shadow-lg shadow-pink-500/50' : 'border-purple-500/30'
                    }`}
                    onClick={() => setSelectedFilm(screening)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold px-3 py-1 bg-purple-600 rounded-full">
                          {screening.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleScreening(screening.id);
                          }}
                          className={`transition-all ${
                            isSelected ? 'text-pink-500 scale-110' : 'text-gray-400 hover:text-pink-400'
                          }`}
                        >
                          <Heart className={`w-6 h-6 ${isSelected ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 text-white">{screening.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{screening.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                          {formatDate(screening.date)} at {formatTime(screening.time)}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                          {screening.venue}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 mr-2 text-purple-400" />
                          {screening.duration} min • {screening.country}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredScreenings.length === 0 && (
              <div className="text-center py-16">
                <Film className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-xl text-gray-400">
                  {isZh ? '沒有符合篩選條件的場次' : 'No screenings match your filters'}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* My Schedule View */}
            <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-pink-600 w-1 h-8 mr-3"></span>
                {isZh ? `我的電影節時間表 (${mySchedule.length} 場)` : `My Festival Schedule (${mySchedule.length} screenings)`}
              </h2>

              {mySchedule.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <p className="text-xl text-gray-400 mb-2">
                    {isZh ? '尚未選擇任何場次' : 'No screenings selected yet'}
                  </p>
                  <p className="text-gray-500">
                    {isZh ? '瀏覽電影並加入您的時間表！' : 'Browse films and add them to your schedule!'}
                  </p>
                  <button
                    onClick={() => setView('browse')}
                    className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    {isZh ? '瀏覽電影' : 'Browse Films'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {uniqueDates.map(date => {
                    const screeningsOnDate = mySchedule.filter(s => s.date === date);
                    if (screeningsOnDate.length === 0) return null;

                    return (
                      <div key={date} className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-purple-300">
                          {formatDate(date)}
                        </h3>
                        <div className="space-y-3">
                          {screeningsOnDate.map(screening => (
                            <div
                              key={screening.id}
                              className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-purple-400 font-mono font-bold">
                                      {formatTime(screening.time)}
                                    </span>
                                    <h4 className="text-lg font-semibold text-white">
                                      {screening.title}
                                    </h4>
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <span className="flex items-center">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {screening.venue}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {screening.duration} min
                                    </span>
                                    <span>{screening.category}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleScreening(screening.id)}
                                  className="text-pink-500 hover:text-pink-400 transition-colors ml-4"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Film Detail Modal */}
      {selectedFilm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedFilm(null)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full p-8 border-2 border-purple-500 shadow-2xl shadow-purple-500/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-semibold px-3 py-1 bg-purple-600 rounded-full">
                  {selectedFilm.category}
                </span>
                <h2 className="text-3xl font-bold mt-3 text-white">{selectedFilm.title}</h2>
                <p className="text-lg text-gray-400 mt-1">{selectedFilm.director}</p>
              </div>
              <button
                onClick={() => setSelectedFilm(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">{selectedFilm.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">
                  {isZh ? '日期與時間' : 'Date & Time'}
                </div>
                <div className="font-semibold text-white">
                  {formatDate(selectedFilm.date)}<br />
                  {formatTime(selectedFilm.time)}
                </div>
              </div>
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">
                  {isZh ? '場地' : 'Venue'}
                </div>
                <div className="font-semibold text-white">{selectedFilm.venue}</div>
              </div>
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">
                  {isZh ? '片長' : 'Duration'}
                </div>
                <div className="font-semibold text-white">{selectedFilm.duration} {isZh ? '分鐘' : 'minutes'}</div>
              </div>
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">
                  {isZh ? '語言' : 'Language'}
                </div>
                <div className="font-semibold text-white">{selectedFilm.language}</div>
              </div>
            </div>

            <button
              onClick={() => {
                toggleScreening(selectedFilm.id);
                setSelectedFilm(null);
              }}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                selectedScreenings.includes(selectedFilm.id)
                  ? 'bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/50'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/50'
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
