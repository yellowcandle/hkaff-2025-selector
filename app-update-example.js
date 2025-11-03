
// In App.tsx, replace the sample data loading with real HKAFF data:

// OLD: Load sample data
// const data = await filmService.loadAllData();

// NEW: Load real HKAFF data with Figma formatting
const figmaData = {
  "films": [
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
  ],
  "metadata": {
    "source": "HKAFF 2025 Real Data"
  }
};

// Convert to app format
const films = figmaData.films.map(film => ({
  id: film.id,
  title_en: film.title,
  title_tc: film.title, // Add TC translation if available
  director: film.director,
  country: film.country || 'Unknown',
  category_id: 'festival-film', // Map to category
  runtime_minutes: film.runtime,
  synopsis_en: film.synopsis,
  synopsis_tc: film.synopsis, // Add TC translation if available
  poster_url: film.image,
  detail_url_en: `https://www.hkaff.asia/en/film/2025/detail/${film.id}`,
  detail_url_tc: `https://www.hkaff.asia/tc/film/2025/detail/${film.id}`
}));

// Use the converted films in your app...
