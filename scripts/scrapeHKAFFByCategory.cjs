/**
 * HKAFF 2025 Data Scraper - By Category
 * Extract films by visiting each category page individually
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

// Define categories with their section IDs
const categories = [
  { id: 'section-67', name_tc: '開幕電影', name_en: 'Opening Film' },
  { id: 'section-68', name_tc: '神秘場', name_en: 'Surprise Screening' },
  { id: 'section-69', name_tc: '閉幕電影', name_en: 'Closing Film' },
  { id: 'section-70', name_tc: '隆重呈獻', name_en: 'Special Presentation' },
  { id: 'section-71', name_tc: '特別推介', name_en: 'Special Recommendation' },
  { id: 'section-72', name_tc: '香港Short Short地', name_en: 'Hong Kong Short Short' },
  { id: 'section-73', name_tc: '亞洲新導演獎', name_en: 'Asian New Director Award' },
  { id: 'section-74', name_tc: '影迷別注', name_en: 'Cinephile\'s Choice' },
  { id: 'section-75', name_tc: '焦點導演：納華普譚容格坦拿列', name_en: 'Focus Director: Nawapol Thamrongrattanarit' },
  { id: 'section-76', name_tc: '跅跅步柘植義春', name_en: 'Yoshiharu Tsuge' },
  { id: 'section-77', name_tc: '亞洲動畫愛與懼', name_en: 'Asian Animation: Love and Fear' },
  { id: 'section-78', name_tc: '廣角視野', name_en: 'Wide Angle' },
  { id: 'section-79', name_tc: '加沙日常', name_en: 'Gaza Daily' },
  { id: 'section-80', name_tc: '紀錄之眼', name_en: 'Documentary Eye' },
  { id: 'section-81', name_tc: '森之聲——HKAFF X 綠色和平電影精選', name_en: 'Voices of the Forest - HKAFF X Greenpeace Film Selection' }
];

// Scrape films by category
async function scrapeFilmsByCategory(page) {
  console.log('🎬 Scraping films by category...');
  
  const films = [];
  let filmCounter = 1;
  
  try {
    // Process each category
    for (const category of categories) {
      console.log(`🎬 Processing category: ${category.name_tc} (${category.id})...`);
      
      try {
        // Visit the category page
        await page.goto(`${BASE_URL}/tc/film/2025?section=${category.id.replace('section-', '')}`);
        await page.waitForLoadState('networkidle');
        
        // Get all film links from this category (including pagination)
        const categoryLinks = [];
        let hasNextPage = true;
        let pageNum = 1;
        
        while (hasNextPage && pageNum <= 10) { // Safety limit of 10 pages per category
          console.log(`📄 Scraping ${category.name_tc} page ${pageNum}...`);
          
          const pageLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="/tc/film/2025/detail/"]'));
            return links.map(link => ({
              href: link.href,
              title: link.textContent.trim()
            }));
          });
          
          if (pageLinks.length > 0) {
            categoryLinks.push(...pageLinks);
            
            // Check if there's a next page
            const nextPageExists = await page.evaluate((currentPageNum) => {
              const nextLink = document.querySelector(`a[href*="page=${currentPageNum + 1}"]`);
              return nextLink !== null;
            }, pageNum);
            
            if (nextPageExists) {
              pageNum++;
              await page.goto(`${BASE_URL}/tc/film/2025?section=${category.id.replace('section-', '')}&page=${pageNum}`);
              await page.waitForLoadState('networkidle');
            } else {
              hasNextPage = false;
            }
          } else {
            hasNextPage = false;
          }
        }
        
        console.log(`📊 Found ${categoryLinks.length} films in ${category.name_tc}`);
        
        // Process each film in this category
        for (const link of categoryLinks) {
          const filmId = `film-${filmCounter}`;
          
          try {
            console.log(`🎬 Processing ${link.title} (${filmCounter})...`);
            
            await page.goto(link.href);
            await page.waitForLoadState('networkidle');
            
            const filmData = await page.evaluate(({ filmId, categoryId }) => {
              // Extract title from .detail-title
              const titleElement = document.querySelector('.detail-title');
              const title = titleElement ? titleElement.textContent.trim() : '';
              
              // Extract director from .dir-desc
              const directorElement = document.querySelector('.dir-desc');
              const director = directorElement ? directorElement.textContent.trim() : '';
              
              // Extract country and runtime from .detail-desc
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
              
              // Extract synopsis from .ck-box p
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
                id: filmId,
                title_tc: title,
                title_en: title, // We'll get EN version later if needed
                director: director,
                country: country,
                runtime: runtime,
                synopsis_tc: synopsis,
                synopsis_en: synopsis, // We'll get EN version later if needed
                category_id: categoryId,
                poster_url: poster,
                trailer_url: '',
                website_url: window.location.href,
                year: 2025,
                language: 'Mixed',
                subtitles: 'English, Traditional Chinese'
              };
            }, { filmId, categoryId: category.id });
            
            films.push(filmData);
            filmCounter++;
            
          } catch (error) {
            console.error(`❌ Error processing ${link.title}:`, error.message);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error processing category ${category.name_tc}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error scraping films:', error);
  }
  
  console.log(`✅ Scraped ${films.length} films across all categories`);
  return films;
}

// Main execution
async function main() {
  console.log('🚀 Starting HKAFF 2025 scraper by category...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Scrape films by category
    const films = await scrapeFilmsByCategory(page);
    
    // Write films data
    const filmsPath = path.join(OUTPUT_DIR, 'films.json');
    fs.writeFileSync(filmsPath, JSON.stringify(films, null, 2), 'utf8');
    console.log(`✅ Films data written to ${filmsPath}`);
    
    // Generate categories data
    const categoriesData = categories.map((cat, index) => ({
      id: cat.id,
      name_tc: cat.name_tc,
      name_en: cat.name_en,
      sort_order: index,
      description_tc: '',
      description_en: ''
    }));
    
    const categoriesPath = path.join(OUTPUT_DIR, 'categories.json');
    fs.writeFileSync(categoriesPath, JSON.stringify(categoriesData, null, 2), 'utf8');
    console.log(`✅ Categories data written to ${categoriesPath}`);
    
    // Generate venues data (same as before)
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
    
    const venuesPath = path.join(OUTPUT_DIR, 'venues.json');
    fs.writeFileSync(venuesPath, JSON.stringify(venues, null, 2), 'utf8');
    console.log(`✅ Venues data written to ${venuesPath}`);
    
    // Generate empty screenings data for now
    const screenings = [];
    const screeningsPath = path.join(OUTPUT_DIR, 'screenings.json');
    fs.writeFileSync(screeningsPath, JSON.stringify(screenings, null, 2), 'utf8');
    console.log(`✅ Screenings data written to ${screeningsPath}`);
    
    console.log('🎉 Scraping completed successfully!');
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the scraper
main().catch(console.error);
