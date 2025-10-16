/**
 * Generate Sample Screenings for Existing Films
 * Creates realistic screening data for the 75 films currently in the database
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../frontend/public/data');

// Read existing data
console.log('📖 Reading existing data files...\n');
const films = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'films.json'), 'utf8'));
const venues = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'venues.json'), 'utf8'));

console.log(`Found ${films.length} films and ${venues.length} venues\n`);

// Generate screenings for films
const screenings = [];
let screeningId = 1000;

// Festival dates: March 15-24, 2025 (10 days)
const festivalStartDate = new Date(2025, 2, 15); // March 15
const festivalDays = 10;

films.forEach((film, filmIndex) => {
  // Each film gets 2-4 screenings across different venues and dates
  const numScreenings = 2 + Math.floor(Math.random() * 3);
  const usedDateVenue = new Set(); // Track used date-venue combinations

  for (let i = 0; i < numScreenings; i++) {
    let venueIndex, dayOffset, dateVenueKey;
    let attempts = 0;
    
    // Try to find a unique date-venue combination (avoid duplicates)
    do {
      venueIndex = Math.floor(Math.random() * venues.length);
      dayOffset = Math.floor(Math.random() * festivalDays);
      dateVenueKey = `${dayOffset}-${venueIndex}`;
      attempts++;
    } while (usedDateVenue.has(dateVenueKey) && attempts < 20);
    
    usedDateVenue.add(dateVenueKey);

    // Screenings at various times: 14:00, 16:30, 18:30, 21:00
    const possibleHours = [14, 16, 18, 21];
    const hour = possibleHours[Math.floor(Math.random() * possibleHours.length)];
    const minute = (hour === 14 || hour === 21) ? 0 : 30;

    const date = new Date(festivalStartDate);
    date.setDate(date.getDate() + dayOffset);
    
    const datetime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

    // Determine language based on country
    let language = '中文對白，中英文字幕';
    if (film.country) {
      const country = film.country.toLowerCase();
      if (country.includes('日本')) {
        language = '日語對白，中英文字幕';
      } else if (country.includes('韓') || country.includes('南韓')) {
        language = '韓語對話，中英文字幕';
      } else if (country.includes('台灣')) {
        language = '國語對白，中英文字幕';
      } else if (country.includes('泰國')) {
        language = '泰語對白，中英文字幕';
      } else if (country.includes('美國') || country.includes('英國')) {
        language = '英語對白，中英文字幕';
      } else if (country.includes('法國')) {
        language = '法語對白，中英文字幕';
      }
    }

    screenings.push({
      id: `screening-${screeningId++}`,
      film_id: film.id,
      venue_id: venues[venueIndex].id,
      datetime: datetime,
      duration_minutes: film.runtime_minutes || 90,
      language: language,
      booking_url: film.detail_url_tc || '',
      is_sold_out: false
    });
  }
});

// Sort screenings by datetime
screenings.sort((a, b) => a.datetime.localeCompare(b.datetime));

// Write screenings file
console.log('💾 Writing screenings.json...\n');
fs.writeFileSync(path.join(DATA_DIR, 'screenings.json'), JSON.stringify(screenings, null, 2));

console.log(`✅ screenings.json generated with ${screenings.length} screenings`);
console.log(`\n📊 Summary:`);
console.log(`   ${films.length} films`);
console.log(`   ${venues.length} venues`);
console.log(`   ${screenings.length} screenings`);
console.log(`   Average ${(screenings.length / films.length).toFixed(1)} screenings per film`);
console.log(`\n✨ Sample screening data generation complete!`);

