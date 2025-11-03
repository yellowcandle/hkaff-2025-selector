import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { FilmBrowser } from "./components/FilmBrowser";
import { ScheduleView } from "./components/ScheduleView";
import { MySelection } from "./components/MySelection";
import { Film } from "./types/film";
import { films } from "./data/films";
import { Film as FilmIcon } from "lucide-react";

export default function App() {
  const [selectedFilms, setSelectedFilms] = useState<Film[]>(
    [],
  );

  const toggleFilmSelection = (film: Film) => {
    setSelectedFilms((prev) => {
      const isSelected = prev.some((f) => f.id === film.id);
      if (isSelected) {
        return prev.filter((f) => f.id !== film.id);
      } else {
        return [...prev, film];
      }
    });
  };

  const removeFilm = (filmId: string) => {
    setSelectedFilms((prev) =>
      prev.filter((f) => f.id !== filmId),
    );
  };

  const isFilmSelected = (filmId: string) => {
    return selectedFilms.some((f) => f.id === filmId);
  };

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
            <TabsTrigger value="browse">
              Browse Films
            </TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="selection">
              My Selection ({selectedFilms.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <FilmBrowser
              films={films}
              selectedFilms={selectedFilms}
              onToggleSelection={toggleFilmSelection}
              isFilmSelected={isFilmSelected}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleView selectedFilms={selectedFilms} />
          </TabsContent>

          <TabsContent value="selection">
            <MySelection
              selectedFilms={selectedFilms}
              onRemoveFilm={removeFilm}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}