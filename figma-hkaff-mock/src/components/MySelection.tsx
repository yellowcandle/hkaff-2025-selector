import { Film } from "../types/film";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Clock,
  MapPin,
  Globe,
  X,
  Film as FilmIcon,
} from "lucide-react";

interface MySelectionProps {
  selectedFilms: Film[];
  onRemoveFilm: (filmId: string) => void;
}

export function MySelection({
  selectedFilms,
  onRemoveFilm,
}: MySelectionProps) {
  if (selectedFilms.length === 0) {
    return (
      <div className="text-center py-12">
        <FilmIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">
          Your selection is empty. Browse films and add them to
          create your personal festival lineup.
        </p>
      </div>
    );
  }

  const totalRuntime = selectedFilms.reduce(
    (sum, film) => sum + film.runtime,
    0,
  );
  const hours = Math.floor(totalRuntime / 60);
  const minutes = totalRuntime % 60;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
        <h2 className="mb-2">Your Selection</h2>
        <div className="flex flex-wrap gap-4 text-gray-700">
          <div className="flex items-center gap-2">
            <FilmIcon className="w-5 h-5 text-purple-600" />
            <span>{selectedFilms.length} films selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>
              {hours}h {minutes}m total runtime
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {selectedFilms.map((film) => (
          <Card
            key={film.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-0">
              <div className="flex gap-4 p-4">
                <div className="relative w-24 h-36 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                  <ImageWithFallback
                    src={film.image}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 line-clamp-1">
                        {film.title}
                      </h3>
                      <p className="text-gray-600">
                        {film.director}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFilm(film.id)}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {film.genre.map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="text-xs"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {film.country} • {film.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{film.runtime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {film.screenings.length} screenings
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-700 line-clamp-2">
                    {film.synopsis}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}