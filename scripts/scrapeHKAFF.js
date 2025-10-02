/**
 * HKAFF 2025 Data Scraper
 * T007-T013: Extract venues, categories, films, and screenings
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.hkaff.hk';
const OUTPUT_DIR = path.join(__dirname, '../frontend/public/data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// T007: Scrape venues
async function scrapeVenues(page) {
  console.log('📍 Scraping venues...');

  // TC venues
  await page.goto(`${BASE_URL}/tc/film/2025`, { waitUntil: 'domcontentloaded' });
  const venuesTC = await page.evaluate(() => {
    const select = document.querySelector('select[name="venue"]');
    if (!select) return [];
    return Array.from(select.options)
      .filter(opt => opt.value && opt.value !== '')
      .map((opt, idx) => ({
        id: `venue-${opt.value}`,
        name_tc: opt.textContent.trim(),
        name_en: '',
        address_tc: '',
        address_en: '',
        map_url: ''
      }));
  });

  // EN venues
  await page.goto(`${BASE_URL}/en/film/2025`, { waitUntil: 'domcontentloaded' });
  const venuesEN = await page.evaluate(() => {
    const select = document.querySelector('select[name="venue"]');
    if (!select) return [];
    return Array.from(select.options)
      .filter(opt => opt.value && opt.value !== '')
      .map(opt => ({
        id: `venue-${opt.value}`,
        name_en: opt.textContent.trim()
      }));
  });

  // Merge
  const venues = venuesTC.map(v => {
    const enVenue = venuesEN.find(en => en.id === v.id);
    return { ...v, name_en: enVenue?.name_en || v.name_tc };
  });

  console.log(`✅ Found ${venues.length} venues`);
  return venues;
}

// T008: Scrape categories
async function scrapeCategories(page) {
  console.log('🎬 Scraping categories...');

  // TC categories
  await page.goto(`${BASE_URL}/tc/film/2025`, { waitUntil: 'domcontentloaded' });
  const categoriesTC = await page.evaluate(() => {
    const select = document.querySelector('select[name="section"]');
    if (!select) return [];
    return Array.from(select.options)
      .filter(opt => opt.value && opt.value !== '')
      .map((opt, idx) => ({
        id: `category-${opt.value}`,
        name_tc: opt.textContent.trim(),
        name_en: '',
        sort_order: idx,
        description_tc: '',
        description_en: ''
      }));
  });

  // EN categories
  await page.goto(`${BASE_URL}/en/film/2025`, { waitUntil: 'domcontentloaded' });
  const categoriesEN = await page.evaluate(() => {
    const select = document.querySelector('select[name="section"]');
    if (!select) return [];
    return Array.from(select.options)
      .filter(opt => opt.value && opt.value !== '')
      .map(opt => ({
        id: `category-${opt.value}`,
        name_en: opt.textContent.trim()
      }));
  });

  // Merge
  const categories = categoriesTC.map(c => {
    const enCat = categoriesEN.find(en => en.id === c.id);
    return { ...c, name_en: enCat?.name_en || c.name_tc };
  });

  console.log(`✅ Found ${categories.length} categories`);
  return categories;
}

// T009-T010: Scrape films
async function scrapeFilms(page) {
  console.log('🎞️ Scraping films...');
  const films = new Map();

  // Get film list from catalogue page (TC)
  await page.goto(`${BASE_URL}/tc/film/2025`, { waitUntil: 'domcontentloaded' });

  const filmLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/tc/film/2025/detail/"]'));
    return [...new Set(links.map(a => a.href))]; // Unique URLs
  });

  console.log(`Found ${filmLinks.length} film detail pages`);

  // Scrape each film (TC)
  for (let i = 0; i < filmLinks.length; i++) {
    const url = filmLinks[i];
    const filmId = url.match(/detail\/(\d+)/)?.[1];
    if (!filmId) continue;

    console.log(`[${i + 1}/${filmLinks.length}] Scraping film ${filmId} (TC)...`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

      const filmData = await page.evaluate((id) => {
        const title = document.querySelector('h1')?.textContent.trim() || '';
        const synopsis = document.querySelector('.synopsis, .description, p')?.textContent.trim() || '';
        const runtimeText = document.body.textContent.match(/(\d+)\s*分鐘|(\d+)\s*mins/i);
        const runtime = runtimeText ? parseInt(runtimeText[1] || runtimeText[2]) : 90;
        const director = document.querySelector('.director')?.textContent.trim() || '';
        const country = document.querySelector('.country')?.textContent.trim() || '';
        const poster = document.querySelector('img[src*="poster"], img')?.src || '';
        const categoryMatch = document.body.textContent.match(/category[=\-](\d+)/i);

        return {
          id: `film-${id}`,
          title_tc: title,
          synopsis_tc: synopsis,
          runtime_minutes: runtime,
          director,
          country,
          poster_url: poster,
          detail_url_tc: window.location.href,
          category_id: categoryMatch ? `category-${categoryMatch[1]}` : 'category-67',
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

  // Get EN film data
  await page.goto(`${BASE_URL}/en/film/2025`, { waitUntil: 'domcontentloaded' });

  const filmLinksEN = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/en/film/2025/detail/"]'));
    return [...new Set(links.map(a => a.href))];
  });

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
        const title = document.querySelector('h1')?.textContent.trim() || '';
        const synopsis = document.querySelector('.synopsis, .description, p')?.textContent.trim() || '';

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

  await page.goto(`${BASE_URL}/tc/schedule/2025`, { waitUntil: 'domcontentloaded' });

  const screenings = await page.evaluate(() => {
    const items = document.querySelectorAll('.screening-item, tr[data-screening], .schedule-row');
    return Array.from(items).map((el, idx) => {
      const dateStr = el.querySelector('.date')?.textContent.trim() || '';
      const timeStr = el.querySelector('.time')?.textContent.trim() || '';
      const filmId = el.dataset?.film || el.querySelector('[data-film]')?.dataset?.film || '';
      const venueId = el.dataset?.venue || el.querySelector('[data-venue]')?.dataset?.venue || '';
      const language = el.querySelector('.language')?.textContent.trim() || '';

      return {
        id: `screening-${1000 + idx}`,
        film_id: filmId ? `film-${filmId}` : '',
        venue_id: venueId ? `venue-${venueId}` : '',
        datetime: `${dateStr} ${timeStr}`,
        language
      };
    }).filter(s => s.film_id && s.venue_id);
  });

  console.log(`✅ Found ${screenings.length} screenings`);

  // Enrich with duration from films
  const enriched = screenings.map(s => {
    const film = films.find(f => f.id === s.film_id);
    return {
      ...s,
      duration_minutes: film?.runtime_minutes || 90
    };
  });

  return enriched;
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