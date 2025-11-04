import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hero } from '../components/Hero/Hero';
import { FilterPanel } from '../components/FilterPanel/FilterPanel';
import { FilmList } from '../components/FilmList/FilmList';
import { ScheduleView } from '../components/ScheduleView/ScheduleView';
import { LanguageToggle } from '../components/LanguageToggle/LanguageToggle';
import type { Film, Category, Venue, Screening, Selection } from '../types';

export type HomePageView = 'catalogue' | 'schedule';

type QueryState = {
  view: HomePageView;
  category: string | null;
  venue: string | null;
  date: string | null;
  search: string;
};

const isHomePageView = (value: string | null): value is HomePageView =>
  value === 'catalogue' || value === 'schedule';

interface HomePageProps {
  films: Film[];
  categories: Category[];
  venues: Venue[];
  screenings: Screening[];
  selections: Selection[];
  selectedFilmIds: string[];
  onFilmSelect: (film: Film) => void;
  onSelectScreening: (screening: Screening) => void;
  onRemoveSelection: (screeningId: string) => void;
  onExportSchedule: () => void;
  onOpenScheduler: () => void;
}

const DEFAULT_VIEW: HomePageView = 'catalogue';

export const HomePage: React.FC<HomePageProps> = ({
  films,
  categories,
  venues,
  screenings,
  selections,
  selectedFilmIds,
  onFilmSelect,
  onSelectScreening,
  onRemoveSelection,
  onExportSchedule,
  onOpenScheduler,
}) => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'tc';

  const getQueryState = useCallback((): QueryState => {
    if (typeof window === 'undefined') {
      return {
        view: DEFAULT_VIEW,
        category: null,
        venue: null,
        date: null,
        search: '',
      };
    }

    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const categoryParam = params.get('category');
    const venueParam = params.get('venue');
    const dateParam = params.get('date');
    const searchParam = params.get('q');

    return {
      view: isHomePageView(viewParam) ? viewParam : DEFAULT_VIEW,
      category: categoryParam || null,
      venue: venueParam || null,
      date: dateParam || null,
      search: searchParam || '',
    };
  }, []);

  const initialQueryState = useMemo<QueryState>(() => getQueryState(), [getQueryState]);

  const [currentView, setCurrentView] = useState<HomePageView>(initialQueryState.view);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialQueryState.category);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(initialQueryState.venue);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialQueryState.date);
  const [searchQuery, setSearchQuery] = useState<string>(initialQueryState.search);

  const updateQueryParam = useCallback(
    (key: 'view' | 'category' | 'venue' | 'date' | 'q', value: string | null) => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      const queryString = params.toString();
      const url = queryString ? `?${queryString}` : window.location.pathname;
      window.history.replaceState({}, '', url);
    },
    [],
  );

  useEffect(() => {
    updateQueryParam('view', currentView === DEFAULT_VIEW ? null : currentView);
  }, [currentView, updateQueryParam]);

  useEffect(() => {
    updateQueryParam('category', selectedCategory);
  }, [selectedCategory, updateQueryParam]);

  useEffect(() => {
    updateQueryParam('venue', selectedVenue);
  }, [selectedVenue, updateQueryParam]);

  useEffect(() => {
    updateQueryParam('date', selectedDate);
  }, [selectedDate, updateQueryParam]);

  useEffect(() => {
    updateQueryParam('q', searchQuery.trim() ? searchQuery : null);
  }, [searchQuery, updateQueryParam]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onPopState = () => {
      const state = getQueryState();
      setCurrentView(state.view);
      setSelectedCategory(state.category);
      setSelectedVenue(state.venue);
      setSelectedDate(state.date);
      setSearchQuery(state.search);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [getQueryState]);

  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    screenings.forEach((screening) => {
      if (screening.datetime) {
        dates.add(screening.datetime.split('T')[0]);
      }
    });
    return Array.from(dates).sort();
  }, [screenings]);

  const filteredFilms = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return films.filter((film) => {
      if (selectedCategory && film.category_id !== selectedCategory) {
        return false;
      }

      if (selectedVenue) {
        const hasVenueScreening = screenings.some(
          (screening) => screening.film_id === film.id && screening.venue_id === selectedVenue,
        );
        if (!hasVenueScreening) return false;
      }

      if (selectedDate) {
        const hasDateScreening = screenings.some(
          (screening) => screening.film_id === film.id && screening.datetime.startsWith(selectedDate),
        );
        if (!hasDateScreening) return false;
      }

      if (!normalizedQuery) return true;

      const category = categories.find((cat) => cat.id === film.category_id);
      const matchesTitle =
        film.title_tc.toLowerCase().includes(normalizedQuery) ||
        film.title_en.toLowerCase().includes(normalizedQuery);
      const matchesDirector = film.director?.toLowerCase().includes(normalizedQuery) || false;
      const matchesCategory =
        category &&
        (category.name_tc.toLowerCase().includes(normalizedQuery) ||
          category.name_en.toLowerCase().includes(normalizedQuery));

      return matchesTitle || matchesDirector || matchesCategory;
    });
  }, [films, categories, screenings, selectedCategory, selectedVenue, selectedDate, searchQuery]);

  const selectedFilmIdSet = useMemo(() => new Set(selectedFilmIds), [selectedFilmIds]);

  const resultAnnouncement = useMemo(
    () =>
      t('filter.resultsCount', {
        count: filteredFilms.length,
        defaultValue:
          filteredFilms.length === 1 ? '1 result' : `${filteredFilms.length} results`,
      }),
    [filteredFilms.length, t],
  );

  const previewSelections = useMemo(() => selections.slice(0, 3), [selections]);
  const extraSelectionCount = Math.max(0, selections.length - previewSelections.length);

  const intlDate = useMemo(() => new Intl.DateTimeFormat(isZh ? 'zh-HK' : 'en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }), [isZh]);
  const intlTime = useMemo(() => new Intl.DateTimeFormat(isZh ? 'zh-HK' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }), [isZh]);

  const handleFilmClick = useCallback(
    (film: Film) => {
      if (currentView !== 'catalogue') {
        setCurrentView('catalogue');
      }
      onFilmSelect(film);
    },
    [currentView, onFilmSelect],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
      <Hero />

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-center gap-2 rounded-full bg-gray-100 p-2 shadow-inner lg:justify-start">
            {(['catalogue', 'schedule'] as HomePageView[]).map((tab) => {
              const isActive = currentView === tab;
              const label =
                tab === 'catalogue'
                  ? t('navigation.catalogue', { defaultValue: 'Film Catalogue' })
                  : t('navigation.schedule', { defaultValue: 'My Schedule' });

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCurrentView(tab)}
                  className={`flex-1 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg'
                      : 'text-gray-700 hover:text-purple-700'
                  }`}
                  aria-pressed={isActive}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 lg:justify-end">
            <span className="hidden text-sm font-medium text-gray-500 sm:inline">
              {t('language.tc', { defaultValue: '繁' })} / {t('language.en', { defaultValue: 'EN' })}
            </span>
            <LanguageToggle />
            <button
              type="button"
              onClick={onOpenScheduler}
              className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            >
              {t('schedule.cta', { defaultValue: 'Open Scheduler' })}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="sr-only" role="status" aria-live="polite">
          {resultAnnouncement}
        </div>

        {currentView === 'catalogue' ? (
          <div className="space-y-8">
            <div className="rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
              <FilterPanel
                categories={categories}
                venues={venues}
                dates={uniqueDates}
                selectedCategory={selectedCategory}
                selectedVenue={selectedVenue}
                selectedDate={selectedDate}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory}
                onVenueChange={setSelectedVenue}
                onDateChange={setSelectedDate}
                onSearchChange={setSearchQuery}
                onClearFilters={() => {
                  setSelectedCategory(null);
                  setSelectedVenue(null);
                  setSelectedDate(null);
                  setSearchQuery('');
                }}
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section>
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 shadow-inner">
                  <span>
                    {t('filter.resultsCount', {
                      count: filteredFilms.length,
                      defaultValue:
                        filteredFilms.length === 1 ? '1 result' : `${filteredFilms.length} results`,
                    })}
                  </span>
                  <span className="text-xs text-purple-500">
                    {t('filter.activeFilters', { defaultValue: 'Active filters' })}:{' '}
                    {[
                      selectedCategory ? t('filter.category', { defaultValue: 'Category' }) : null,
                      selectedVenue ? t('filter.venue', { defaultValue: 'Venue' }) : null,
                      selectedDate ? t('filter.mobileToggle', { defaultValue: 'Filters' }) : null,
                      searchQuery ? t('filter.searchLabel', { defaultValue: 'Search films' }) : null,
                    ]
                      .filter(Boolean)
                      .join(', ') || t('filter.noActiveFilters', { defaultValue: 'None' })}
                  </span>
                </div>

                <FilmList
                  films={filteredFilms}
                  categories={categories}
                  screenings={screenings}
                  venues={venues}
                  onFilmClick={handleFilmClick}
                  regionLabelId="catalogue-heading"
                />
              </section>

              <aside className="space-y-4">
                <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-blue-50 p-6 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-purple-800">
                        {t('schedule.title', { defaultValue: 'My Schedule' })}
                      </h2>
                      <p className="text-sm text-purple-600">
                        {t('schedule.summary', {
                          count: selections.length,
                          defaultValue:
                            selections.length === 1
                              ? '1 screening selected'
                              : `${selections.length} screenings selected`,
                        })}
                      </p>
                      {selectedFilmIdSet.size > 0 && (
                        <p className="text-xs text-purple-500">
                          {isZh
                            ? `已加入 ${selectedFilmIdSet.size} 套影片`
                            : `${selectedFilmIdSet.size} films in focus`}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      {selections.length}
                    </span>
                  </div>

                  {previewSelections.length > 0 ? (
                    <ul className="space-y-3">
                      {previewSelections.map((selection) => {
                        const screeningDate = new Date(selection.screening_snapshot.datetime);
                        const formattedDate = intlDate.format(screeningDate);
                        const formattedTime = intlTime.format(screeningDate);
                        const title = isZh
                          ? selection.film_snapshot.title_tc
                          : selection.film_snapshot.title_en;
                        const venueName = isZh
                          ? selection.venue_snapshot.name_tc
                          : selection.venue_snapshot.name_en;

                        return (
                          <li
                            key={selection.screening_id}
                            className="group rounded-2xl bg-white/80 p-4 shadow transition-all duration-200 hover:shadow-lg"
                          >
                            <button
                              type="button"
                              onClick={() => onSelectScreening(selection.screening_snapshot)}
                              className="w-full text-left"
                            >
                              <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-purple-700">
                                {title}
                              </h3>
                              <p className="mt-1 text-xs text-gray-500">
                                {formattedDate} · {formattedTime}
                              </p>
                              <p className="mt-1 text-xs font-medium text-purple-600">
                                {venueName}
                              </p>
                            </button>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-gray-400">#{selection.screening_id.slice(-6)}</span>
                              <button
                                type="button"
                                onClick={() => onRemoveSelection(selection.screening_id)}
                                className="rounded-full px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                              >
                                {t('schedule.remove', { defaultValue: 'Remove' })}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-purple-200 bg-white/70 p-6 text-center text-sm text-purple-500">
                      {t('schedule.emptyDescription', {
                        defaultValue: 'Browse the catalogue and add screenings to build your plan.',
                      })}
                    </div>
                  )}

                  {extraSelectionCount > 0 && (
                    <p className="mt-3 text-xs text-purple-500">
                      {isZh
                        ? `還有 ${extraSelectionCount} 場場次`
                        : `${extraSelectionCount} more screenings`}
                    </p>
                  )}

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={onExportSchedule}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                    >
                      <span>⬇️</span>
                      {t('schedule.export', { defaultValue: 'Export as Markdown' })}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView('schedule')}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-600 shadow-sm transition-colors duration-200 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                    >
                      <span>🗓️</span>
                      {isZh ? '查看完整時間表' : 'View full schedule'}
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-xl backdrop-blur-md">
            <ScheduleView
              selections={selections}
              onRemove={onRemoveSelection}
              onNavigateToCatalogue={() => setCurrentView('catalogue')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
