/**
 * Update poster URLs in films.json to point to existing local poster files
 */

const fs = require('fs');
const path = require('path');

const POSTERS_DIR = path.join(__dirname, '../frontend/public/posters/hkaff');
const FILMS_FILE = path.join(__dirname, '../frontend/public/data/films.json');

// Read films data
const films = JSON.parse(fs.readFileSync(FILMS_FILE, 'utf-8'));

// Read all poster files
const posterFiles = fs.readdirSync(POSTERS_DIR);

// Create a mapping of film ID to poster filename
const posterMap = {};

posterFiles.forEach(filename => {
  // Match patterns like: 376_Another-World.jpg, 378_Pass-and-goal.jpg
  const match = filename.match(/^(\d+)_(.+)$/);
  if (match) {
    const filmId = `film-${match[1]}`;
    const posterPath = `/posters/hkaff/${filename}`;
    
    // If multiple posters exist for same film, prefer .jpg files
    if (!posterMap[filmId] || filename.endsWith('.jpg')) {
      posterMap[filmId] = posterPath;
    }
  }
});

// Update films with poster URLs
let updated = 0;
films.forEach(film => {
  if (posterMap[film.id] && (!film.poster_url || film.poster_url === '')) {
    film.poster_url = posterMap[film.id];
    updated++;
  }
});

// Write back to file
fs.writeFileSync(FILMS_FILE, JSON.stringify(films, null, 2));

console.log(`✅ Updated ${updated} films with poster URLs`);
console.log(`📊 Total films: ${films.length}`);
console.log(`🖼️  Total poster files: ${Object.keys(posterMap).length}`);

