/**
 * Generate Sample HKAFF Data
 * T013: Alternative - Create realistic sample data for development
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../frontend/public/data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Venues from research.md
const venues = [
  { id: 'venue-36', name_tc: '百老匯電影中心', name_en: 'Broadway Cinematheque', address_tc: '油麻地眾坊街3號駿發花園H2地庫', address_en: 'Shop H2, B/F, Prosperous Garden, 3 Public Square Street, Yau Ma Tei', map_url: '' },
  { id: 'venue-37', name_tc: 'PREMIERE ELEMENTS', name_en: 'PREMIERE ELEMENTS', address_tc: '九龍灣宏泰道1號億京中心E座地下', address_en: 'G/F, Tower E, Billion Centre, 1 Wang Tai Road, Kowloon Bay', map_url: '' },
  { id: 'venue-38', name_tc: 'MOViE MOViE Pacific Place', name_en: 'MOViE MOViE Pacific Place', address_tc: '金鐘太古廣場', address_en: 'Pacific Place, Admiralty', map_url: '' },
  { id: 'venue-39', name_tc: 'MOViE MOViE Cityplaza', name_en: 'MOViE MOViE Cityplaza', address_tc: '太古城中心', address_en: 'Cityplaza, Taikoo Shing', map_url: '' },
  { id: 'venue-40', name_tc: 'GALA CINEMA', name_en: 'GALA CINEMA', address_tc: '尖沙咀', address_en: 'Tsim Sha Tsui', map_url: '' },
  { id: 'venue-41', name_tc: 'PALACE ifc', name_en: 'PALACE ifc', address_tc: '中環國際金融中心商場', address_en: 'ifc mall, Central', map_url: '' },
  { id: 'venue-42', name_tc: 'MY CINEMA YOHO MALL', name_en: 'MY CINEMA YOHO MALL', address_tc: '元朗YOHO MALL', address_en: 'YOHO MALL, Yuen Long', map_url: '' },
  { id: 'venue-43', name_tc: 'B+ cinema apm', name_en: 'B+ cinema apm', address_tc: '觀塘apm', address_en: 'apm, Kwun Tong', map_url: '' }
];

// Categories from research.md
const categories = [
  { id: 'category-67', name_tc: '開幕電影', name_en: 'Opening Film', sort_order: 0, description_tc: '', description_en: '' },
  { id: 'category-68', name_tc: '神秘場', name_en: 'Mystery Screening', sort_order: 1, description_tc: '', description_en: '' },
  { id: 'category-69', name_tc: '閉幕電影', name_en: 'Closing Film', sort_order: 2, description_tc: '', description_en: '' },
  { id: 'category-70', name_tc: '隆重呈獻', name_en: 'Special Presentations', sort_order: 3, description_tc: '', description_en: '' },
  { id: 'category-71', name_tc: '特別推介', name_en: 'Special Recommendations', sort_order: 4, description_tc: '', description_en: '' },
  { id: 'category-72', name_tc: '香港Short Short地', name_en: 'Hong Kong Short Short', sort_order: 5, description_tc: '', description_en: '' },
  { id: 'category-73', name_tc: '亞洲新導演獎', name_en: 'Asian New Talent Award', sort_order: 6, description_tc: '', description_en: '' },
  { id: 'category-74', name_tc: '影迷別注', name_en: 'Fan Favorites', sort_order: 7, description_tc: '', description_en: '' },
  { id: 'category-75', name_tc: '焦點導演', name_en: 'Focus Director', sort_order: 8, description_tc: '', description_en: '' },
  { id: 'category-76', name_tc: '亞洲動畫愛與懼', name_en: 'Asian Animation: Love & Fear', sort_order: 9, description_tc: '', description_en: '' },
  { id: 'category-77', name_tc: '廣角視野', name_en: 'Wide Angle', sort_order: 10, description_tc: '', description_en: '' },
  { id: 'category-78', name_tc: '加沙日常', name_en: 'Gaza Daily', sort_order: 11, description_tc: '', description_en: '' },
  { id: 'category-79', name_tc: '紀錄之眼', name_en: 'Documentary Eye', sort_order: 12, description_tc: '', description_en: '' },
  { id: 'category-80', name_tc: '森之聲', name_en: 'Forest Voices', sort_order: 13, description_tc: '', description_en: '' }
];

// Sample films (realistic data)
const films = [
  {
    id: 'film-101', title_tc: '世外', title_en: 'Another World', category_id: 'category-67',
    synopsis_tc: '一對夫婦在疫情期間逃離城市，尋找內心的平靜。', synopsis_en: 'A couple escapes the city during the pandemic to find inner peace.',
    runtime_minutes: 120, director: '張藝謀', country: '中國', poster_url: '/posters/film-101.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/101', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/101'
  },
  {
    id: 'film-102', title_tc: '國寶', title_en: 'KOKUHO', category_id: 'category-70',
    synopsis_tc: '探索日本國寶級藝術品背後的故事。', synopsis_en: 'Exploring the stories behind Japan\'s national treasure artworks.',
    runtime_minutes: 110, director: '小津安二郎', country: '日本', poster_url: '/posters/film-102.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/102', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/102'
  },
  {
    id: 'film-103', title_tc: '電競女孩', title_en: 'Gamer Girls', category_id: 'category-71',
    synopsis_tc: '三位女性電競選手的奮鬥故事。', synopsis_en: 'The journey of three female esports players.',
    runtime_minutes: 95, director: '李安', country: '台灣', poster_url: '/posters/film-103.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/103', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/103'
  },
  {
    id: 'film-104', title_tc: '春光乍洩', title_en: 'Happy Together', category_id: 'category-74',
    synopsis_tc: '兩個男人在阿根廷的愛情故事。', synopsis_en: 'A love story between two men in Argentina.',
    runtime_minutes: 96, director: '王家衛', country: '香港', poster_url: '/posters/film-104.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/104', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/104'
  },
  {
    id: 'film-105', title_tc: '燃燒女子的畫像', title_en: 'Portrait of a Lady on Fire', category_id: 'category-70',
    synopsis_tc: '18世紀法國，一位畫家與她的模特兒之間的禁忌之戀。', synopsis_en: 'A forbidden romance between a painter and her subject in 18th century France.',
    runtime_minutes: 122, director: 'Céline Sciamma', country: '法國', poster_url: '/posters/film-105.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/105', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/105'
  },
  {
    id: 'film-106', title_tc: '寄生上流', title_en: 'Parasite', category_id: 'category-74',
    synopsis_tc: '一個貧窮家庭逐步滲透到富有家庭的生活中。', synopsis_en: 'A poor family infiltrates the life of a wealthy household.',
    runtime_minutes: 132, director: '奉俊昊', country: '韓國', poster_url: '/posters/film-106.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/106', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/106'
  },
  {
    id: 'film-107', title_tc: '海街日記', title_en: 'Our Little Sister', category_id: 'category-71',
    synopsis_tc: '三姊妹與同父異母妹妹的溫馨家庭故事。', synopsis_en: 'A heartwarming story of three sisters and their half-sister.',
    runtime_minutes: 128, director: '是枝裕和', country: '日本', poster_url: '/posters/film-107.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/107', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/107'
  },
  {
    id: 'film-108', title_tc: '美麗人生', title_en: 'Life is Beautiful', category_id: 'category-70',
    synopsis_tc: '一位父親在集中營中用幽默保護兒子的故事。', synopsis_en: 'A father uses humor to protect his son in a concentration camp.',
    runtime_minutes: 116, director: 'Roberto Benigni', country: '意大利', poster_url: '/posters/film-108.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/108', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/108'
  },
  {
    id: 'film-109', title_tc: '少年的你', title_en: 'Better Days', category_id: 'category-73',
    synopsis_tc: '高考壓力下，兩個少年的相互救贖。', synopsis_en: 'Two teenagers find redemption amidst exam pressure.',
    runtime_minutes: 135, director: '曾國祥', country: '中國', poster_url: '/posters/film-109.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/109', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/109'
  },
  {
    id: 'film-110', title_tc: '小偷家族', title_en: 'Shoplifters', category_id: 'category-74',
    synopsis_tc: '一個依靠偷竊為生的家庭收養了一個被虐待的女孩。', synopsis_en: 'A family of petty thieves takes in an abused girl.',
    runtime_minutes: 121, director: '是枝裕和', country: '日本', poster_url: '/posters/film-110.jpg',
    detail_url_tc: 'https://www.hkaff.hk/tc/film/2025/detail/110', detail_url_en: 'https://www.hkaff.hk/en/film/2025/detail/110'
  }
];

// Generate screenings for films
const screenings = [];
let screeningId = 1000;

films.forEach((film, filmIndex) => {
  // Each film gets 3-5 screenings across different venues and dates
  const numScreenings = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < numScreenings; i++) {
    const venueIndex = Math.floor(Math.random() * venues.length);
    const dayOffset = Math.floor(Math.random() * 10); // Festival runs for 10 days
    const hour = 14 + Math.floor(Math.random() * 6) * 2; // Screenings at 14:00, 16:00, 18:00, 20:00, 22:00
    const minute = Math.random() > 0.5 ? 30 : 0;

    const date = new Date(2025, 2, 15 + dayOffset); // March 15-24, 2025
    const datetime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

    screenings.push({
      id: `screening-${screeningId++}`,
      film_id: film.id,
      venue_id: venues[venueIndex].id,
      datetime: datetime,
      duration_minutes: film.runtime_minutes,
      language: '中文對白，中英文字幕'
    });
  }
});

// Sort screenings by datetime
screenings.sort((a, b) => a.datetime.localeCompare(b.datetime));

// Write files
console.log('💾 Writing data files...\n');

fs.writeFileSync(path.join(OUTPUT_DIR, 'venues.json'), JSON.stringify(venues, null, 2));
console.log(`✅ venues.json (${venues.length} venues)`);

fs.writeFileSync(path.join(OUTPUT_DIR, 'categories.json'), JSON.stringify(categories, null, 2));
console.log(`✅ categories.json (${categories.length} categories)`);

fs.writeFileSync(path.join(OUTPUT_DIR, 'films.json'), JSON.stringify(films, null, 2));
console.log(`✅ films.json (${films.length} films)`);

fs.writeFileSync(path.join(OUTPUT_DIR, 'screenings.json'), JSON.stringify(screenings, null, 2));
console.log(`✅ screenings.json (${screenings.length} screenings)`);

console.log('\n✨ Sample data generation complete!');
console.log(`📊 Summary: ${venues.length} venues | ${categories.length} categories | ${films.length} films | ${screenings.length} screenings`);
