import { useState } from 'react';
import { Film } from '../types/film';
import { FilmCard } from './FilmCard';
import { FilmDetailsDialog } from './FilmDetailsDialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Search, Filter } from 'lucide-react';

interface FilmBrowserProps {
  films: Film[];
  selectedFilms: Film[];
  onToggleSelection: (film: Film) => void;
  isFilmSelected: (filmId: string) => boolean;
}

export function FilmBrowser({ films, selectedFilms, onToggleSelection, isFilmSelected }: FilmBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [detailsFilm, setDetailsFilm] = useState<Film | null>(null);

  // Extract unique values for filters
  const allGenres = Array.from(new Set(films.flatMap(f => f.genre))).sort();
  const allVenues = Array.from(new Set(films.flatMap(f => f.screenings.map(s => s.venue)))).sort();
  const allDates = Array.from(new Set(films.flatMap(f => f.screenings.map(s => s.date)))).sort();

  // Filter films
  const filteredFilms = films.filter((film) => {
    const matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      film.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      film.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenre === 'all' || film.genre.includes(selectedGenre);
    
    const matchesVenue = selectedVenue === 'all' || 
      film.screenings.some(s => s.venue === selectedVenue);
    
    const matchesDate = selectedDate === 'all' || 
      film.screenings.some(s => s.date === selectedDate);

    return matchesSearch && matchesGenre && matchesVenue && matchesDate;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const activeFiltersCount = [selectedGenre, selectedVenue, selectedDate].filter(f => f !== 'all').length;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by title, director, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Filters:</span>
          </div>
          
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {allGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedVenue} onValueChange={setSelectedVenue}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Venues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              {allVenues.map((venue) => (
                <SelectItem key={venue} value={venue}>
                  {venue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[160px]">
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

          {activeFiltersCount > 0 && (
            <Badge variant="secondary">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-gray-600">
        Showing {filteredFilms.length} of {films.length} films
      </div>

      {/* Film Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFilms.map((film) => (
          <FilmCard
            key={film.id}
            film={film}
            isSelected={isFilmSelected(film.id)}
            onToggleSelection={() => onToggleSelection(film)}
            onViewDetails={() => setDetailsFilm(film)}
          />
        ))}
      </div>

      {filteredFilms.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No films found matching your criteria. Try adjusting your filters.
        </div>
      )}

      {/* Film Details Dialog */}
      {detailsFilm && (
        <FilmDetailsDialog
          film={detailsFilm}
          isSelected={isFilmSelected(detailsFilm.id)}
          onToggleSelection={() => onToggleSelection(detailsFilm)}
          onClose={() => setDetailsFilm(null)}
        />
      )}
    </div>
  );
}
