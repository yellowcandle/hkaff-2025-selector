/**
 * HKAFF 2025 Data Scraper
 * T007-T013: Extract venues, categories, films, and screenings
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.hkaff.asia';
const OUTPUT_DIR = path.join(__dirname, '../frontend/public/data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// T007: Scrape venues
async function scrapeVenues(page) {
  console.log('📍 Scraping venues...');

  // Hardcoded venues from HKAFF 2025 (dropdown items don't have value attributes)
  const venues = [
    { id: 'venue-1', name_tc: '百老匯電影中心', name_en: 'Broadway Cinematheque', address_tc: '', address_en: '', map_url: '' },
    { id: 'venue-2', name_tc: 'PREMIERE ELEMENTS', name_en: 'PREMIERE ELEMENTS', address_tc: '', address_en: '', map_url: '' },
    { id: 'venue-3', name_tc: 'MOViE MOViE Pacific Place', name_en: 'MOViE MOViE Pacific Place', address_tc: '', address_en: '', map_url: '' },
    { id: 'venue-4', name_tc: 'MOViE MOViE Cityplaza', name_en: 'MOViE MOViE Cityplaza', address_tc: '', address_en: '', map_url: '' },
    { id: 'venue-5', name_tc: 'GALA CINEMA', name_en: 'GALA CINEMA', address_tc: '', address_en: '', map_url: '' },
    { id: 'venue-6', name_tc: 'PALACE ifc', name_en: 'PALACE ifc', address_tc: '', address_en: '', map_url: '' },
    { id: 'venue-7', name_tc: 'MY CINEMA YOHO MALL', name_en: 'MY CINEMA YOHO MALL', address_tc: '', address_en: '', map_url: '' },
    { id: 'venue-8', name_tc: 'B+ cinema apm', name_en: 'B+ cinema apm', address_tc: '', address_en: '', map_url: '' }
  ];

  console.log(`✅ Found ${venues.length} venues`);
  return venues;
}

// T008: Scrape categories
async function scrapeCategories(page) {
  console.log('🎬 Scraping categories...');

  // Hardcoded categories from HKAFF 2025 with correct section IDs
  const categories = [
    { id: 'section-1', name_tc: '開幕電影', name_en: 'Opening Film', sort_order: 0, description_tc: '', description_en: '' },
    { id: 'section-2', name_tc: '神秘場', name_en: 'Surprise Screening', sort_order: 1, description_tc: '', description_en: '' },
    { id: 'section-3', name_tc: '閉幕電影', name_en: 'Closing Film', sort_order: 2, description_tc: '', description_en: '' },
    { id: 'section-4', name_tc: '隆重呈獻', name_en: 'Special Presentation', sort_order: 3, description_tc: '', description_en: '' },
    { id: 'section-5', name_tc: '特別推介', name_en: 'Special Recommendation', sort_order: 4, description_tc: '', description_en: '' },
    { id: 'section-6', name_tc: '香港Short Short地', name_en: 'Hong Kong Short Short', sort_order: 5, description_tc: '', description_en: '' },
    { id: 'section-7', name_tc: '亞洲新導演獎', name_en: 'Asian New Director Award', sort_order: 6, description_tc: '', description_en: '' },
    { id: 'section-8', name_tc: '影迷別注', name_en: 'Cinephile\'s Choice', sort_order: 7, description_tc: '', description_en: '' },
    { id: 'section-9', name_tc: '焦點導演：納華普譚容格坦拿列', name_en: 'Focus Director: Nawapol Thamrongrattanarit', sort_order: 8, description_tc: '', description_en: '' },
    { id: 'section-10', name_tc: '跅跅步柘植義春', name_en: 'Yoshiharu Tsuge', sort_order: 9, description_tc: '', description_en: '' },
    { id: 'section-77', name_tc: '亞洲動畫愛與懼', name_en: 'Asian Animation: Love and Fear', sort_order: 10, description_tc: '', description_en: '' },
    { id: 'section-11', name_tc: '廣角視野', name_en: 'Wide Angle', sort_order: 11, description_tc: '', description_en: '' },
    { id: 'section-12', name_tc: '加沙日常', name_en: 'Gaza Daily', sort_order: 12, description_tc: '', description_en: '' },
    { id: 'section-13', name_tc: '紀錄之眼', name_en: 'Documentary Eye', sort_order: 13, description_tc: '', description_en: '' },
    { id: 'section-14', name_tc: '森之聲——HKAFF X 綠色和平電影精選', name_en: 'Voices of the Forest - HKAFF X Greenpeace Film Selection', sort_order: 14, description_tc: '', description_en: '' }
  ];

  console.log(`✅ Found ${categories.length} categories`);
  return categories;
}

// T009-T010: Scrape films
async function scrapeFilms(page) {
  console.log('🎞️ Scraping films...');
  const films = new Map();
  const allFilmLinks = new Set();

  // Get film list from all pages (TC) - pagination has 7 pages
  for (let pageNum = 1; pageNum <= 7; pageNum++) {
    console.log(`📄 Fetching film list from page ${pageNum}/7...`);
    await page.goto(`${BASE_URL}/tc/film/2025?page=${pageNum}`, { waitUntil: 'domcontentloaded' });

    const filmLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/tc/film/2025/detail/"]'));
      return links.map(a => a.href);
    });

    filmLinks.forEach(link => allFilmLinks.add(link));
  }

  const filmLinksArray = Array.from(allFilmLinks);
  console.log(`Found ${filmLinksArray.length} unique film detail pages`);

  // Scrape each film (TC)
  for (let i = 0; i < filmLinksArray.length; i++) {
    const url = filmLinksArray[i];
    const filmId = url.match(/detail\/(\d+)/)?.[1];
    if (!filmId) continue;

    console.log(`[${i + 1}/${filmLinksArray.length}] Scraping film ${filmId} (TC)...`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

      const filmData = await page.evaluate((id) => {
        // Get title from .detail-title
        const titleElement = document.querySelector('.detail-title');
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        // Get country/year/runtime from .detail-desc
        const descElement = document.querySelector('.detail-desc');
        let country = '';
        let runtime = 90;
        
        if (descElement) {
          const descText = descElement.textContent.trim();
          // Match "泰國 / 2012 / 68min"
          const match = descText.match(/([^\n\/]+?)\s*\/\s*(\d{4})\s*\/\s*(\d+)\s*min/);
          if (match) {
            country = match[1].trim();
            runtime = parseInt(match[3]);
          }
        }
        
        // Get director from .dir-desc
        const directorElement = document.querySelector('.dir-desc');
        const director = directorElement ? directorElement.textContent.trim() : '';
        
        // Get synopsis from .ck-box p
        const synopsisElement = document.querySelector('.ck-box p');
        const synopsis = synopsisElement ? synopsisElement.textContent.trim() : '';
        
        // Get poster - look for images in the page (excluding logos)
        const posterImg = Array.from(document.querySelectorAll('img')).find(img => 
          img.src && 
          !img.src.includes('logo') && 
          !img.src.includes('icon') &&
          !img.src.includes('header') &&
          (img.src.includes('poster') || img.src.includes('film') || img.width > 100)
        );
        const poster = posterImg ? posterImg.src : '';

        return {
          id: `film-${id}`,
          title_tc: title,
          synopsis_tc: synopsis,
          runtime_minutes: runtime,
          director,
          country,
          poster_url: poster,
          detail_url_tc: window.location.href,
          category_id: 'section-77', // Default to Asian Animation category
          title_en: '',
          synopsis_en: '',
          detail_url_en: ''
        };
      }, filmId);

      films.set(filmData.id, filmData);
    } catch (err) {
      console.warn(`⚠️  Failed to scrape film ${filmId} (TC): ${err.message}`);
    }
  }

  // Get EN film data from all pages
  const allFilmLinksEN = new Set();
  for (let pageNum = 1; pageNum <= 7; pageNum++) {
    console.log(`📄 Fetching EN film list from page ${pageNum}/7...`);
    await page.goto(`${BASE_URL}/en/film/2025?page=${pageNum}`, { waitUntil: 'domcontentloaded' });

    const filmLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/en/film/2025/detail/"]'));
      return links.map(a => a.href);
    });

    filmLinks.forEach(link => allFilmLinksEN.add(link));
  }

  const filmLinksEN = Array.from(allFilmLinksEN);

  for (let i = 0; i < filmLinksEN.length; i++) {
    const url = filmLinksEN[i];
    const filmId = url.match(/detail\/(\d+)/)?.[1];
    if (!filmId) continue;

    const film = films.get(`film-${filmId}`);
    if (!film) continue;

    console.log(`[${i + 1}/${filmLinksEN.length}] Scraping film ${filmId} (EN)...`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

      const filmDataEN = await page.evaluate(() => {
        // Get title from .detail-title
        const titleElement = document.querySelector('.detail-title');
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        // Get synopsis from .ck-box p
        const synopsisElement = document.querySelector('.ck-box p');
        const synopsis = synopsisElement ? synopsisElement.textContent.trim() : '';

        return {
          title_en: title,
          synopsis_en: synopsis,
          detail_url_en: window.location.href
        };
      });

      Object.assign(film, filmDataEN);
    } catch (err) {
      console.warn(`⚠️  Failed to scrape film ${filmId} (EN): ${err.message}`);
    }
  }

  const filmsArray = Array.from(films.values());
  console.log(`✅ Scraped ${filmsArray.length} films`);
  return filmsArray;
}

// T011: Scrape screenings
async function scrapeScreenings(page, films, venues) {
  console.log('🎫 Scraping screenings...');

  let screeningCounter = 0;
  const allScreenings = [];

  // Scrape screenings from each film detail page
  console.log(`Extracting screenings from ${films.length} films...`);
  
  for (let i = 0; i < films.length; i++) {
    const film = films[i];
    
    if ((i + 1) % 10 === 0) {
      console.log(`  Progress: ${i + 1}/${films.length} films processed...`);
    }
    
    try {
      await page.goto(film.detail_url_tc, { waitUntil: 'domcontentloaded', timeout: 10000 });

      const filmScreenings = await page.evaluate(({ filmId, filmRuntime }) => {
        const screeningTable = document.querySelector('.time-venue-table');
        if (!screeningTable) return [];

        const rows = screeningTable.querySelectorAll('tr');
        const screenings = [];

        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            screenings.push({
              datetime: cells[0].textContent.trim(),
              venue: cells[1].textContent.trim(),
              film_id: filmId,
              duration_minutes: filmRuntime
            });
          }
        });

        return screenings;
      }, { filmId: film.id, filmRuntime: film.runtime_minutes });

      // Convert to proper screening objects with ISO datetime
      filmScreenings.forEach(screening => {
        // Parse datetime "25/10 7:30PM" or "* 22/10 7:00PM"
        const cleanDatetime = screening.datetime.replace(/^\*\s*/, ''); // Remove leading asterisk
        const dateMatch = cleanDatetime.match(/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})(AM|PM)/i);
        
        if (dateMatch) {
          const day = dateMatch[1].padStart(2, '0');
          const month = dateMatch[2].padStart(2, '0');
          let hour = parseInt(dateMatch[3]);
          const minute = dateMatch[4];
          const ampm = dateMatch[5].toUpperCase();

          if (ampm === 'PM' && hour !== 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;

          const datetime = `2025-${month}-${day}T${hour.toString().padStart(2, '0')}:${minute}:00`;

          // Find venue ID (match by name)
          const venue = venues.find(v => 
            v.name_tc === screening.venue || v.name_en === screening.venue
          );
          const venueId = venue ? venue.id : `venue-${screening.venue.replace(/\s+/g, '-')}`;

          allScreenings.push({
            id: `screening-${++screeningCounter}`,
            film_id: screening.film_id,
            venue_id: venueId,
            datetime: datetime,
            duration_minutes: screening.duration_minutes,
            language: '' // Could be extracted from .detail-desc if needed
          });
        }
      });
      
      if (filmScreenings.length > 0) {
        console.log(`    Found ${filmScreenings.length} screenings for ${film.title_tc || film.id}`);
      }
    } catch (err) {
      console.warn(`    Error processing ${film.id}: ${err.message}`);
    }
  }

  console.log(`✅ Found ${allScreenings.length} screenings`);
  return allScreenings;
}

// Main scraper
async function main() {
  console.log('🚀 HKAFF 2025 Scraper\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  try {
    // T007-T011: Scrape all data
    const venues = await scrapeVenues(page);
    const categories = await scrapeCategories(page);
    const films = await scrapeFilms(page);
    const screenings = await scrapeScreenings(page, films, venues);

    // T012: Write JSON files
    console.log('\n💾 Writing data files...');

    fs.writeFileSync(path.join(OUTPUT_DIR, 'venues.json'), JSON.stringify(venues, null, 2));
    console.log('✅ venues.json');

    fs.writeFileSync(path.join(OUTPUT_DIR, 'categories.json'), JSON.stringify(categories, null, 2));
    console.log('✅ categories.json');

    fs.writeFileSync(path.join(OUTPUT_DIR, 'films.json'), JSON.stringify(films, null, 2));
    console.log('✅ films.json');

    fs.writeFileSync(path.join(OUTPUT_DIR, 'screenings.json'), JSON.stringify(screenings, null, 2));
    console.log('✅ screenings.json');

    console.log('\n✨ Scraping complete!');
    console.log(`📊 ${venues.length} venues | ${categories.length} categories | ${films.length} films | ${screenings.length} screenings`);

  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { scrapeVenues, scrapeCategories, scrapeFilms, scrapeScreenings };