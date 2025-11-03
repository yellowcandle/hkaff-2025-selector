#!/usr/bin/env node

/**
 * Sync Real HKAFF Data to Figma Design
 *
 * This script reads the scraped HKAFF data and syncs it to the Figma design
 * for the Film Festival Scheduler.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const POSTERS_DIR = path.join(__dirname, '../all-hkaff-posters');
const METADATA_FILE = path.join(POSTERS_DIR, 'comprehensive-metadata.json');
const OUTPUT_DIR = path.join(__dirname, '../frontend/dist/data');

// Figma design URL (extracted from the provided link)
const FIGMA_FILE_KEY = 'xSJQeigKcA5DqdpwOnhnm2';
const FIGMA_NODE_ID = '0-1';

/**
 * Load comprehensive metadata
 */
function loadMetadata() {
  try {
    const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    console.log(`📊 Loaded metadata: ${metadata.totalFilms} films, ${metadata.totalUniquePosters} posters`);
    return metadata;
  } catch (error) {
    console.error('❌ Failed to load metadata:', error.message);
    process.exit(1);
  }
}

/**
 * Extract film data from metadata and file structure
 */
function extractFilmData(metadata) {
  const films = [];
  const filmMap = new Map();

  // Group posters by film ID
  metadata.posters.forEach(poster => {
    const filmId = poster.filmId;
    if (!filmMap.has(filmId)) {
      filmMap.set(filmId, {
        id: filmId,
        posters: [],
        metadata: null
      });
    }
    filmMap.get(filmId).posters.push(poster);
  });

  // Convert to film objects
  for (const [filmId, filmData] of filmMap) {
    // Find the best poster (prefer known films, then largest file)
    const bestPoster = filmData.posters
      .filter(p => p.success)
      .sort((a, b) => {
        // Prefer known films
        if (a.filmId === 'known' && b.filmId !== 'known') return -1;
        if (b.filmId === 'known' && a.filmId !== 'known') return 1;
        // Then by file size (larger = better quality)
        return b.size - a.size;
      })[0];

    if (bestPoster) {
      films.push({
        id: filmId,
        poster_url: `/posters/hkaff/${bestPoster.filename}`,
        poster_filename: bestPoster.filename,
        poster_size: bestPoster.size,
        poster_url_original: bestPoster.url,
        title_tc: `Film ${filmId}`, // Placeholder - would need to be scraped from HKAFF site
        title_en: `Film ${filmId}`,
        director: 'Unknown Director', // Placeholder
        country: 'Unknown Country', // Placeholder
        category_id: 'unknown',
        runtime_minutes: 90, // Placeholder
        synopsis_tc: 'Synopsis in Traditional Chinese', // Placeholder
        synopsis_en: 'Synopsis in English', // Placeholder
        detail_url_tc: `https://www.hkaff.asia/tc/film/2025/detail/${filmId}`,
        detail_url_en: `https://www.hkaff.asia/en/film/2025/detail/${filmId}`
      });
    }
  }

  return films.sort((a, b) => parseInt(a.id) - parseInt(b.id));
}

/**
 * Generate sample screenings for the films
 */
function generateScreenings(films, venues) {
  const screenings = [];
  let screeningId = 1;

  // Festival dates: March 15-24, 2025 (10 days)
  const festivalStartDate = new Date(2025, 2, 15); // March 15
  const festivalDays = 10;

  films.forEach((film, filmIndex) => {
    // Each film gets 2-4 screenings
    const numScreenings = 2 + Math.floor(Math.random() * 3);
    const usedDateVenue = new Set();

    for (let i = 0; i < numScreenings; i++) {
      let venueIndex, dayOffset, dateVenueKey;
      let attempts = 0;

      // Find unique date-venue combination
      do {
        venueIndex = Math.floor(Math.random() * venues.length);
        dayOffset = Math.floor(Math.random() * festivalDays);
        dateVenueKey = `${dayOffset}-${venueIndex}`;
        attempts++;
      } while (usedDateVenue.has(dateVenueKey) && attempts < 20);

      usedDateVenue.add(dateVenueKey);

      // Screening times
      const possibleHours = [14, 16, 18, 21];
      const hour = possibleHours[Math.floor(Math.random() * possibleHours.length)];
      const minute = (hour === 14 || hour === 21) ? 0 : 30;

      const date = new Date(festivalStartDate);
      date.setDate(date.getDate() + dayOffset);

      const datetime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

      screenings.push({
        id: `screening-${screeningId++}`,
        film_id: film.id,
        venue_id: venues[venueIndex].id,
        datetime: datetime,
        duration_minutes: film.runtime_minutes || 90,
        language: '中文對白，中英文字幕',
        booking_url: film.detail_url_tc,
        is_sold_out: false
      });
    }
  });

  return screenings.sort((a, b) => a.datetime.localeCompare(b.datetime));
}

/**
 * Load existing venues and categories
 */
function loadExistingData() {
  const venues = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'venues.json'), 'utf8'));
  const categories = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'categories.json'), 'utf8'));
  return { venues, categories };
}

/**
 * Save data files
 */
function saveDataFiles(films, screenings, venues, categories) {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Save films
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'films.json'),
    JSON.stringify(films, null, 2)
  );

  // Save screenings
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'screenings.json'),
    JSON.stringify(screenings, null, 2)
  );

  // Copy venues and categories (unchanged)
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'venues.json'),
    JSON.stringify(venues, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2)
  );

  console.log('💾 Data files saved successfully!');
}

/**
 * Generate Figma-compatible data export
 */
function generateFigmaExport(films, screenings, venues, categories) {
  const figmaData = {
    films: films.map(film => ({
      id: film.id,
      title: film.title_en,
      director: film.director,
      country: film.country,
      year: 2025,
      runtime: film.runtime_minutes,
      genre: ['Festival Film'], // Placeholder
      synopsis: film.synopsis_en,
      venue: 'Multiple Venues', // Placeholder
      screenings: screenings
        .filter(s => s.film_id === film.id)
        .slice(0, 3) // Limit to 3 screenings for display
        .map(s => {
          const venue = venues.find(v => v.id === s.venue_id);
          return {
            id: s.id,
            date: s.datetime.split('T')[0],
            time: s.datetime.split('T')[1]?.substring(0, 5) || '',
            venue: venue?.name_en || ''
          };
        }),
      language: 'Chinese',
      subtitles: 'English',
      rating: 'PG-13', // Placeholder
      image: film.poster_url
    })),
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'HKAFF 2025 Real Data',
      totalFilms: films.length,
      totalScreenings: screenings.length
    }
  };

  // Save Figma export
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'figma-export.json'),
    JSON.stringify(figmaData, null, 2)
  );

  console.log('🎨 Figma export data generated!');
  return figmaData;
}

/**
 * Main execution
 */
async function main() {
  console.log('🎬 Starting HKAFF to Figma sync...\n');

  // Load metadata
  const metadata = loadMetadata();

  // Extract film data from posters
  const films = extractFilmData(metadata);
  console.log(`🎭 Extracted ${films.length} films from poster data`);

  // Load existing venues and categories
  const { venues, categories } = loadExistingData();
  console.log(`🏛️ Loaded ${venues.length} venues and ${categories.length} categories`);

  // Generate screenings
  const screenings = generateScreenings(films, venues);
  console.log(`📅 Generated ${screenings.length} screenings`);

  // Save data files
  saveDataFiles(films, screenings, venues, categories);

  // Generate Figma export
  const figmaData = generateFigmaExport(films, screenings, venues, categories);

  console.log('\n📊 Sync Summary:');
  console.log(`   ${films.length} films with real posters`);
  console.log(`   ${screenings.length} generated screenings`);
  console.log(`   Data saved to: ${OUTPUT_DIR}`);
  console.log(`   Figma export: ${path.join(OUTPUT_DIR, 'figma-export.json')}`);

  console.log('\n✨ HKAFF to Figma sync complete!');
  console.log('🎯 Ready to update Figma design with real data!');
}

// Run the script
main().catch(console.error);