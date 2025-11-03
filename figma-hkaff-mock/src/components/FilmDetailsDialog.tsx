import { Film } from '../types/film';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Clock, MapPin, Calendar, Globe, Languages, Check, Plus } from 'lucide-react';

interface FilmDetailsDialogProps {
  film: Film;
  isSelected: boolean;
  onToggleSelection: () => void;
  onClose: () => void;
}

export function FilmDetailsDialog({ film, isSelected, onToggleSelection, onClose }: FilmDetailsDialogProps) {
  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    return `${dateStr} at ${time}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{film.title}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
              <ImageWithFallback
                src={film.image}
                alt={film.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {film.genre.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2">About</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[80px]">Director:</span>
                  <span>{film.director}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{film.country} • {film.year}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{film.runtime} minutes</span>
                </div>
                <div className="flex items-start gap-2">
                  <Languages className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{film.language}</span>
                  {film.subtitles !== 'None' && (
                    <span className="text-gray-500">(Subtitles: {film.subtitles})</span>
                  )}
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[80px]">Rating:</span>
                  <Badge variant="outline">{film.rating}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2">Synopsis</h3>
              <p className="text-gray-700 leading-relaxed">{film.synopsis}</p>
            </div>

            <div>
              <h3 className="mb-3">Screenings</h3>
              <div className="space-y-2">
                {film.screenings.map((screening) => (
                  <div
                    key={screening.id}
                    className="flex items-start gap-2 p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>{formatDateTime(screening.date, screening.time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{screening.venue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={onToggleSelection}
              className="w-full"
              variant={isSelected ? 'outline' : 'default'}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Remove from Selection
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Selection
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
