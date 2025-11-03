import { Film } from '../types/film';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Clock, MapPin, Calendar, Check, Plus, Info } from 'lucide-react';

interface FilmCardProps {
  film: Film;
  isSelected: boolean;
  onToggleSelection: () => void;
  onViewDetails: () => void;
}

export function FilmCard({ film, isSelected, onToggleSelection, onViewDetails }: FilmCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={film.image}
          alt={film.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white">
            {film.rating}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="mb-1 line-clamp-1">{film.title}</h3>
          <p className="text-gray-600 mb-3">
            {film.director} • {film.year}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {film.genre.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="space-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{film.runtime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{film.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{film.screenings.length} screenings</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
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
            onClick={onToggleSelection}
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
