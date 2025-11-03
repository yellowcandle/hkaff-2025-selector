import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageWithFallback } from './ImageWithFallback';
import { Clock, MapPin, Calendar, Check, Plus, Info } from 'lucide-react';

interface FilmCardProps {
  film: {
    id: string;
    title: string;
    director: string;
    year: number;
    runtime: number;
    genre: string[];
    rating?: string;
    image: string;
    venue: string;
    screenings: Array<{ id: string; date: string; time: string; venue: string }>;
  };
  isSelected: boolean;
  onToggleSelection: () => void;
  onViewDetails: () => void;
}

export function FilmCard({ film, isSelected, onToggleSelection, onViewDetails }: FilmCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons or links
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    onToggleSelection();
  };

  // Get first screening for date/time/venue display
  const firstScreening = film.screenings[0];
  const displayVenue = film.venue || firstScreening?.venue || '';
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group cursor-pointer w-full h-full ${
        isSelected 
          ? 'ring-2 ring-primary/20' 
          : ''
      }`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleSelection();
        }
      }}
      aria-label={`${isSelected ? 'Remove' : 'Add'} ${film.title} to selection`}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 group-hover:scale-[1.02] transition-transform duration-300">
        <ImageWithFallback
          src={film.image}
          alt={film.title}
          className="w-full h-full object-cover"
        />

        {film.rating && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white">
              {film.rating}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="mb-1 line-clamp-1 font-medium">{film.title}</h3>
          <p className="text-gray-600 mb-3 text-sm">
            {film.director} • {film.year}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {film.genre.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="space-y-2 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{film.runtime} min</span>
            </div>
            {displayVenue && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{displayVenue}</span>
              </div>
            )}
            {firstScreening ? (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  {formatDate(firstScreening.date)} {firstScreening.time}
                  {film.screenings.length > 1 && ` (+${film.screenings.length - 1} more)`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>0 screenings</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex-1"
          >
            <Info className="w-4 h-4 mr-1" />
            Details
          </Button>
          <Button
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelection();
            }}
            className="flex-1"
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
