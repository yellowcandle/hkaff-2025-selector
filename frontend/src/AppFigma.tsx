import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { FilmBrowser } from './components/figma/FilmBrowser';
import { Film as FilmIcon } from 'lucide-react';
import { filmService } from './services/filmService';
import { storageService } from './services/storageService';
import type { Film, Screening, Venue } from './types';
import { LoadingSpinner } from './components/Loading/LoadingSpinner';

// Convert service types to frontend types
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

// Adapter to convert current data structure to Figma format
const convertToFigmaFormat = (
  films: Film[],
  screenings: Screening[],
  venues: Venue[]
) => {
  return films.map(film => {
    const filmScreenings = screenings
      .filter(s => s.film_id === film.id)
      .map(s => {
        const venue = venues.find(v => v.id === s.venue_id);
        return {
          id: s.id,
          date: s.datetime.split('T')[0],
          time: s.datetime.split('T')[1]?.substring(0, 5) || '',
          venue: venue?.name_en || ''
        };
      });

    const primaryVenue = filmScreenings.length > 0
      ? filmScreenings[0].venue
      : '';

    // Try to extract rating from title or use default
    const rating = film.title_en.includes('18') ? 'R' :
                   film.title_en.includes('PG') ? 'PG' : 'PG-13';

    return {
      id: film.id,
      title: film.title_en,
      director: film.director || 'Unknown Director',
      country: film.country || 'Unknown',
      year: new Date().getFullYear(),
      runtime: film.runtime_minutes,
      genre: [film.category_id], // Would need category mapping
      synopsis: film.synopsis_en,
      venue: primaryVenue,
      screenings: filmScreenings,
      language: 'English',
      subtitles: 'English',
      rating: rating,
      image: film.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=1200&fit=crop'
    };
  });
};

export default function AppFigma() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedFilmIds, setSelectedFilmIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await filmService.loadAllData();
        setFilms(data.films.map(convertServiceFilm));
        setScreenings(data.screenings.map(convertServiceScreening));
        setVenues(data.venues);

        // Load selected films from storage
        const selections = storageService.getSelections();
        const selectedIds = new Set(selections.map(s => s.film_snapshot.id));
        setSelectedFilmIds(selectedIds);

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load festival data');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const figmaFilms = useMemo(() =>
    convertToFigmaFormat(films, screenings, venues),
    [films, screenings, venues]
  );

  const selectedFilms = useMemo(() =>
    figmaFilms.filter(f => selectedFilmIds.has(f.id)),
    [figmaFilms, selectedFilmIds]
  );

  const toggleFilmSelection = (film: any) => {
    setSelectedFilmIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(film.id)) {
        newSet.delete(film.id);
      } else {
        newSet.add(film.id);
      }
      return newSet;
    });
  };

  const isFilmSelected = (filmId: string) => {
    return selectedFilmIds.has(filmId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          text={isZh ? '載入中...' : 'Loading...'}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {isZh ? '載入失敗' : 'Failed to Load'}
          </h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            {isZh ? '重新載入' : 'Reload'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FilmIcon className="w-10 h-10 text-purple-600" />
            <h1 className="text-purple-900">HKAFF scheduler</h1>
          </div>
          <p className="text-gray-600">
            Your personal film festival guide and scheduler
          </p>
        </header>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="browse">Browse Films</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="selection">
              My Selection ({selectedFilms.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <FilmBrowser
              films={figmaFilms}
              selectedFilms={selectedFilms}
              onToggleSelection={toggleFilmSelection}
              isFilmSelected={isFilmSelected}
              onViewDetails={(film) => console.log('View details:', film)}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <div className="text-center py-12 text-gray-500">
              Schedule view coming soon...
            </div>
          </TabsContent>

          <TabsContent value="selection">
            <div className="text-center py-12 text-gray-500">
              My Selection view coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
