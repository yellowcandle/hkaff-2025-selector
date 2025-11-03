
// Example: Integrating Real HKAFF Data with Figma-style Components
import { FilmBrowser } from './components/figma/FilmBrowser';
import { useState } from 'react';

// Real HKAFF film data (from figma-export.json)
const realHKAFFFilms = [
  {
    "id": "known",
    "title": "Film known",
    "director": "Unknown Director",
    "country": "Unknown Country",
    "year": 2025,
    "runtime": 90,
    "genre": [
      "Festival Film"
    ],
    "synopsis": "Synopsis in English",
    "venue": "Multiple Venues",
    "screenings": [
      {
        "id": "screening-1",
        "date": "2025-03-19",
        "time": "21:00",
        "venue": "MOViE MOViE Cityplaza"
      },
      {
        "id": "screening-2",
        "date": "2025-03-21",
        "time": "16:30",
        "venue": "MOViE MOViE Pacific Place"
      }
    ],
    "language": "Chinese",
    "subtitles": "English",
    "rating": "PG-13",
    "image": "/posters/hkaff/known_6154da433f8472b7b24572968d1ef85f.png"
  },
  {
    "id": "376",
    "title": "Film 376",
    "director": "Unknown Director",
    "country": "Unknown Country",
    "year": 2025,
    "runtime": 90,
    "genre": [
      "Festival Film"
    ],
    "synopsis": "Synopsis in English",
    "venue": "Multiple Venues",
    "screenings": [
      {
        "id": "screening-4",
        "date": "2025-03-22",
        "time": "21:00",
        "venue": "B+ cinema apm"
      },
      {
        "id": "screening-3",
        "date": "2025-03-24",
        "time": "14:00",
        "venue": "MOViE MOViE Cityplaza"
      }
    ],
    "language": "Chinese",
    "subtitles": "English",
    "rating": "PG-13",
    "image": "/posters/hkaff/376_6154da433f8472b7b24572968d1ef85f.png"
  },
  {
    "id": "377",
    "title": "Film 377",
    "director": "Unknown Director",
    "country": "Unknown Country",
    "year": 2025,
    "runtime": 90,
    "genre": [
      "Festival Film"
    ],
    "synopsis": "Synopsis in English",
    "venue": "Multiple Venues",
    "screenings": [
      {
        "id": "screening-6",
        "date": "2025-03-15",
        "time": "14:00",
        "venue": "MOViE MOViE Cityplaza"
      },
      {
        "id": "screening-5",
        "date": "2025-03-20",
        "time": "21:00",
        "venue": "PALACE ifc"
      },
      {
        "id": "screening-7",
        "date": "2025-03-22",
        "time": "21:00",
        "venue": "PREMIERE ELEMENTS"
      }
    ],
    "language": "Chinese",
    "subtitles": "English",
    "rating": "PG-13",
    "image": "/posters/hkaff/377_48f05572bf95181019454df202bd7d4b.jpeg"
  }
];

export function HKAFFFilmBrowser() {
  const [selectedFilmIds, setSelectedFilmIds] = useState(new Set());

  const handleToggleSelection = (film) => {
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

  const isFilmSelected = (filmId) => selectedFilmIds.has(filmId);

  const handleViewDetails = (film) => {
    console.log('View details for:', film.title);
    // Open film detail modal
  };

  return (
    <FilmBrowser
      films={realHKAFFFilms}
      selectedFilms={realHKAFFFilms.filter(f => isFilmSelected(f.id))}
      onToggleSelection={handleToggleSelection}
      isFilmSelected={isFilmSelected}
      onViewDetails={handleViewDetails}
    />
  );
}
