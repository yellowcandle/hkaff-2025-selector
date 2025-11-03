export interface Film {
  id: string;
  title: string;
  director: string;
  country: string;
  year: number;
  runtime: number; // in minutes
  genre: string[];
  synopsis: string;
  venue: string;
  screenings: Screening[];
  language: string;
  subtitles: string;
  rating: string;
  image: string;
}

export interface Screening {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  venue: string;
}
