
// WORKING DEMO: HKAFF Film Browser with Real Data
import React, { useState } from 'react';
import { FilmBrowser } from './components/figma/FilmBrowser';

// Real HKAFF data (first 6 films)
const hkaffFilms = [
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
  },
  {
    "id": "378",
    "title": "Film 378",
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
        "id": "screening-10",
        "date": "2025-03-15",
        "time": "21:00",
        "venue": "MOViE MOViE Pacific Place"
      },
      {
        "id": "screening-8",
        "date": "2025-03-20",
        "time": "14:00",
        "venue": "PREMIERE ELEMENTS"
      },
      {
        "id": "screening-9",
        "date": "2025-03-21",
        "time": "21:00",
        "venue": "GALA CINEMA"
      }
    ],
    "language": "Chinese",
    "subtitles": "English",
    "rating": "PG-13",
    "image": "/posters/hkaff/378_4d9180cd920735688646af87860dff47.jpeg"
  },
  {
    "id": "379",
    "title": "Film 379",
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
        "id": "screening-11",
        "date": "2025-03-18",
        "time": "18:30",
        "venue": "B+ cinema apm"
      },
      {
        "id": "screening-13",
        "date": "2025-03-20",
        "time": "14:00",
        "venue": "MY CINEMA YOHO MALL"
      },
      {
        "id": "screening-12",
        "date": "2025-03-22",
        "time": "14:00",
        "venue": "B+ cinema apm"
      }
    ],
    "language": "Chinese",
    "subtitles": "English",
    "rating": "PG-13",
    "image": "/posters/hkaff/379_43d423cd5991b7a1fdd5f08a3b802bf1.jpeg"
  },
  {
    "id": "380",
    "title": "Film 380",
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
        "id": "screening-15",
        "date": "2025-03-16",
        "time": "18:30",
        "venue": "MOViE MOViE Pacific Place"
      },
      {
        "id": "screening-16",
        "date": "2025-03-17",
        "time": "21:00",
        "venue": "PREMIERE ELEMENTS"
      },
      {
        "id": "screening-14",
        "date": "2025-03-18",
        "time": "18:30",
        "venue": "PALACE ifc"
      }
    ],
    "language": "Chinese",
    "subtitles": "English",
    "rating": "PG-13",
    "image": "/posters/hkaff/380_9275f844e530571d659dd796bd011aa9.png"
  }
];

export default function HKAFFDemo() {
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
    alert(`Details for: ${film.title}
Director: ${film.director}
Runtime: ${film.runtime} min
Venue: ${film.venue}
Screenings: ${film.screenings.length}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">
            HKAFF 2025 - Real Data Demo
          </h1>
          <p className="text-gray-600">
            Film festival scheduler with authentic HKAFF data
          </p>
        </header>

        <FilmBrowser
          films={hkaffFilms}
          selectedFilms={hkaffFilms.filter(f => isFilmSelected(f.id))}
          onToggleSelection={handleToggleSelection}
          isFilmSelected={isFilmSelected}
          onViewDetails={handleViewDetails}
        />

        <div className="mt-8 text-center text-gray-500">
          <p>Selected films: {selectedFilmIds.size} of {hkaffFilms.length}</p>
        </div>
      </div>
    </div>
  );
}
