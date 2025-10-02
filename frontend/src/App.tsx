import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

// Service imports
import { dataLoader } from './services/dataLoader';
import { storageService } from './services/storageService';
import { markdownExporter } from './services/markdownExporter';

// Component imports - Keep critical components as static imports
import { FilmList } from './components/FilmList/FilmList';
import { FilterPanel } from './components/FilterPanel/FilterPanel';
import { LanguageToggle } from './components/LanguageToggle/LanguageToggle';

// Lazy-loaded components for code splitting
const FilmDetail = lazy(() => import('./components/FilmDetail/FilmDetail').then(module => ({ default: module.FilmDetail })));
const ScheduleView = lazy(() => import('./components/ScheduleView/ScheduleView').then(module => ({ default: module.ScheduleView })));
const MarkdownExportModal = lazy(() => import('./components/MarkdownExportModal/MarkdownExportModal').then(module => ({ default: module.MarkdownExportModal })));

// Type imports
import type { Film, Category, Venue, Screening, Selection } from './types';
import type { UserSelection } from '../../specs/001-given-this-film/contracts/service-interfaces';

// Type conversion helpers
const convertServiceFilm = (film: import('../../specs/001-given-this-film/contracts/service-interfaces').Film): Film => ({
  ...film,
  synopsis_tc: film.synopsis_tc || '',
  synopsis_en: film.synopsis_en || '',
  director: film.director || '',
  country: film.country || '',
  poster_url: film.poster_url || '',
  detail_url_tc: film.detail_url_tc || '',
  detail_url_en: film.detail_url_en || '',
});

const convertServiceScreening = (screening: import('../../specs/001-given-this-film/contracts/service-interfaces').Screening): Screening => ({
  ...screening,
  language: screening.language || '',
});

const convertServiceCategory = (category: import('../../specs/001-given-this-film/contracts/service-interfaces').Category): Category => ({
  ...category,
  description_tc: category.description_tc || '',
  description_en: category.description_en || '',
});

const convertUserSelectionToSelection = (userSelection: UserSelection, venues: Venue[]): Selection => {
  const venue = venues.find(v => v.name_tc === userSelection.screening_snapshot.venue_name_tc || v.name_en === userSelection.screening_snapshot.venue_name_en);
  if (!venue) {
    throw new Error(`Venue not found for selection: ${userSelection.screening_id}`);
  }

  return {
    screening_id: userSelection.screening_id,
    added_at: userSelection.added_at,
    film_snapshot: {
      id: userSelection.film_snapshot.id,
      title_tc: userSelection.film_snapshot.title_tc,
      title_en: userSelection.film_snapshot.title_en,
      category_id: '', // This would need to be looked up from films data
      synopsis_tc: '',
      synopsis_en: '',
      runtime_minutes: 0,
      director: '',
      country: '',
      poster_url: userSelection.film_snapshot.poster_url || '',
      detail_url_tc: '',
      detail_url_en: '',
    },
    screening_snapshot: {
      id: userSelection.screening_snapshot.id,
      film_id: '', // This would need to be looked up
      venue_id: venue.id,
      datetime: userSelection.screening_snapshot.datetime,
      duration_minutes: userSelection.screening_snapshot.duration_minutes,
      language: '',
    },
    venue_snapshot: venue,
  };
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              aria-label="Reload page"
              className="w-full min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [films, setFilms] = useState<Film[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI states
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentView, setCurrentView] = useState<'catalogue' | 'schedule'>('catalogue');

  // Selection states
  const [userSelections, setUserSelections] = useState<UserSelection[]>([]);

  // Track if film was opened via URL for proper back button handling
  const [filmOpenedViaURL, setFilmOpenedViaURL] = useState(false);

  // URL sync utility functions
  const getStateFromURL = (): {
    view: 'catalogue' | 'schedule' | null;
    filmId: string | null;
    category: string | null;
    venue: string | null;
    search: string;
  } => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    return {
      view: view === 'catalogue' || view === 'schedule' ? view : null,
      filmId: params.get('film'),
      category: params.get('category'),
      venue: params.get('venue'),
      search: params.get('q') || ''
    };
  };

  const updateURL = (updates: {
    view?: 'catalogue' | 'schedule' | null;
    film?: string | null;
    category?: string | null;
    venue?: string | null;
    q?: string | null;
  }) => {
    const params = new URLSearchParams(window.location.search);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
    });
    
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.pushState({}, '', newURL);
  };

  // T053: Wire dataLoader to App initialization
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await dataLoader.loadAll();

        setFilms(data.films.map(convertServiceFilm));
        setScreenings(data.screenings.map(convertServiceScreening));
        setVenues(data.venues);
        setCategories(data.categories.map(convertServiceCategory));

        // Load selections from storage
        const storedSelections = storageService.getSelections();
        setUserSelections(storedSelections);

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load festival data');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Initialize state from URL on mount (after data loads)
  useEffect(() => {
    if (!isLoading && films.length > 0) {
      const urlState = getStateFromURL();
      
      // Set view from URL
      if (urlState.view) {
        setCurrentView(urlState.view);
      }
      
      // Set film from URL
      if (urlState.filmId) {
        const film = films.find(f => f.id === urlState.filmId);
        if (film) {
          setSelectedFilm(film);
          setFilmOpenedViaURL(true);
        }
      }
      
      // Set filters from URL
      if (urlState.category) {
        setSelectedCategory(urlState.category);
      }
      if (urlState.venue) {
        setSelectedVenue(urlState.venue);
      }
      if (urlState.search) {
        setSearchQuery(urlState.search);
      }
    }
  }, [isLoading, films]);

  // Sync view changes to URL
  useEffect(() => {
    if (!isLoading) {
      updateURL({ view: currentView === 'catalogue' ? null : currentView });
    }
  }, [currentView, isLoading]);

  // Sync film selection to URL
  useEffect(() => {
    if (!isLoading) {
      updateURL({ film: selectedFilm?.id || null });
    }
  }, [selectedFilm, isLoading]);

  // Sync category filter to URL
  useEffect(() => {
    if (!isLoading) {
      updateURL({ category: selectedCategory });
    }
  }, [selectedCategory, isLoading]);

  // Sync venue filter to URL
  useEffect(() => {
    if (!isLoading) {
      updateURL({ venue: selectedVenue });
    }
  }, [selectedVenue, isLoading]);

  // Sync search query to URL with debouncing
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        updateURL({ q: searchQuery || null });
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, isLoading]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlState = getStateFromURL();
      
      setCurrentView(urlState.view || 'catalogue');
      
      if (urlState.filmId) {
        const film = films.find(f => f.id === urlState.filmId);
        if (film) {
          setSelectedFilm(film);
          setFilmOpenedViaURL(true);
        }
      } else {
        setSelectedFilm(null);
        setFilmOpenedViaURL(false);
      }
      
      setSelectedCategory(urlState.category);
      setSelectedVenue(urlState.venue);
      setSearchQuery(urlState.search);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [films]);

  // T054: Derived filtered films state
  const filteredFilms = useMemo(() => {
    let filtered = films;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(film => {
        const matchesTitle = film.title_tc.toLowerCase().includes(query) ||
                            film.title_en.toLowerCase().includes(query);
        const matchesDirector = film.director.toLowerCase().includes(query);
        const category = categories.find(c => c.id === film.category_id);
        const matchesCategory = category && (
          category.name_tc.toLowerCase().includes(query) ||
          category.name_en.toLowerCase().includes(query)
        );
        return matchesTitle || matchesDirector || matchesCategory;
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(film => film.category_id === selectedCategory);
    }

    if (selectedVenue) {
      // Filter films that have at least one screening at the selected venue
      const filmIdsWithVenue = new Set(
        screenings
          .filter(s => s.venue_id === selectedVenue)
          .map(s => s.film_id)
      );
      filtered = filtered.filter(film => filmIdsWithVenue.has(film.id));
    }

    return filtered;
  }, [films, screenings, categories, selectedCategory, selectedVenue, searchQuery]);

  // Convert user selections to frontend Selection type for components
  const selections = useMemo(() => {
    return userSelections.map(us => convertUserSelectionToSelection(us, venues));
  }, [userSelections, venues]);

  // T055: Handle film card click to open detail modal
  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film);
  };

  const handleCloseFilmDetail = () => {
    // If film was opened via URL, use browser back
    if (filmOpenedViaURL) {
      window.history.back();
    } else {
      // Otherwise just clear the state (URL will update via useEffect)
      setSelectedFilm(null);
    }
    setFilmOpenedViaURL(false);
  };

  // Get screenings for selected film
  const filmScreenings = useMemo(() => {
    if (!selectedFilm) return [];
    return screenings.filter(s => s.film_id === selectedFilm.id);
  }, [selectedFilm, screenings]);

  // Get selected screening IDs
  const selectedScreeningIds = useMemo(() => {
    return selections.map(s => s.screening_id);
  }, [selections]);

  // T056: Handle screening selection/removal
  const handleSelectScreening = (screening: Screening) => {
    try {
      const film = films.find(f => f.id === screening.film_id);
      const venue = venues.find(v => v.id === screening.venue_id);

      if (!film || !venue) {
        console.error('Film or venue not found');
        return;
      }

      // Check if already selected
      if (storageService.isSelected(screening.id)) {
        // Remove selection
        storageService.removeSelection(screening.id);
      } else {
        // Add selection
        storageService.addSelection(screening, film, venue);
      }

      // Refresh selections
      const updatedSelections = storageService.getSelections();
      setUserSelections(updatedSelections);
    } catch (err) {
      console.error('Failed to toggle screening:', err);
    }
  };

  const handleRemoveSelection = (screeningId: string) => {
    try {
      storageService.removeSelection(screeningId);
      const updatedSelections = storageService.getSelections();
      setUserSelections(updatedSelections);
    } catch (err) {
      console.error('Failed to remove selection:', err);
    }
  };

  // Handle export
  const handleExport = () => {
    setShowExportModal(true);
  };

  const markdownContent = useMemo(() => {
    const lang = i18n.language as 'tc' | 'en';
    return markdownExporter.exportSchedule(userSelections, lang);
  }, [userSelections, i18n.language]);

  // T059: Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">
            {isZh ? '載入中...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // T059: Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {isZh ? '載入失敗' : 'Failed to Load'}
          </h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            aria-label={isZh ? '重新載入頁面' : 'Reload page'}
            className="w-full min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isZh ? '重新載入' : 'Reload'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-2 focus:py-1 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:text-sm"
        >
          {isZh ? '跳至主要內容' : 'Skip to main content'}
        </a>

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                  {isZh ? '香港亞洲電影節 2025' : 'HKAFF 2025'}
                </h1>
                <p className="text-xs text-gray-600 leading-tight">
                  {isZh ? '選片助手' : 'Screening Selector'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <nav role="navigation" aria-label={isZh ? '主要導航' : 'Main navigation'}>
                  <div className="flex bg-gray-100 rounded-lg p-1" role="tablist">
                    <button
                      onClick={() => setCurrentView('catalogue')}
                      role="tab"
                      aria-selected={currentView === 'catalogue'}
                      aria-label={isZh ? '影片目錄視圖' : 'Catalogue view'}
                      aria-controls="main-content"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        currentView === 'catalogue'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {isZh ? '影片目錄' : 'Catalogue'}
                    </button>
                    <button
                      onClick={() => setCurrentView('schedule')}
                      role="tab"
                      aria-selected={currentView === 'schedule'}
                      aria-label={isZh ? `我的時間表，已選 ${selections.length} 場` : `My Schedule, ${selections.length} selected`}
                      aria-controls="main-content"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                        currentView === 'schedule'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {isZh ? '我的時間表' : 'My Schedule'}
                      {selections.length > 0 && (
                        <span
                          className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          {selections.length}
                        </span>
                      )}
                    </button>
                  </div>
                </nav>

                {/* T058: Language Toggle */}
                <LanguageToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'catalogue' ? (
            <>
              {/* Filter Panel */}
              <FilterPanel
                categories={categories}
                venues={venues}
                selectedCategory={selectedCategory}
                selectedVenue={selectedVenue}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory}
                onVenueChange={setSelectedVenue}
                onSearchChange={setSearchQuery}
                onClearFilters={() => {
                  setSelectedCategory(null);
                  setSelectedVenue(null);
                  setSearchQuery('');
                }}
              />

              {/* Film List */}
              {filteredFilms.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-600">
                    {isZh ? '沒有符合條件的電影' : 'No films match the filters'}
                  </p>
                </div>
              ) : (
                <FilmList
                  films={filteredFilms}
                  categories={categories}
                  onFilmClick={handleFilmClick}
                />
              )}
            </>
          ) : (
            /* Schedule View */
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }>
              <ScheduleView
                selections={selections}
                onRemoveScreening={handleRemoveSelection}
                onExport={handleExport}
              />
            </Suspense>
          )}
        </main>

        {/* Film Detail Modal */}
        {selectedFilm && (
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            <FilmDetail
              film={selectedFilm}
              category={categories.find(c => c.id === selectedFilm.category_id) || null}
              screenings={filmScreenings}
              venues={venues}
              selectedScreeningIds={selectedScreeningIds}
              existingSelections={userSelections}
              onSelectScreening={handleSelectScreening}
              onClose={handleCloseFilmDetail}
            />
          </Suspense>
        )}

        {/* Markdown Export Modal */}
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <MarkdownExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            markdownContent={markdownContent}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;