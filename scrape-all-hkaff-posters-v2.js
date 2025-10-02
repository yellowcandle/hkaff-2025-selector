#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://www.hkaff.asia';
const outputDir = path.join(__dirname, 'all-hkaff-posters');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 Starting comprehensive HKAFF poster scraping (v2)...');
console.log(`📁 Output directory: ${outputDir}`);
console.log(`🌐 Base URL: ${baseUrl}`);

// Known film IDs from our previous discovery
const knownFilmIds = [
  '376', '377', '378', '379', '380', '381', '382', '383', 
  '397', '401', '402', '409'
];

// Known poster URLs from our previous discovery
const knownPosterUrls = [
  '/upload/film/6154da433f8472b7b24572968d1ef85f.png?v22',
  '/upload/film/Another-World.jpg?v22',
  '/upload/film/8bff3d4b44933e875217e5d7a8b89776.png?v22'
];

async function fetchPage(url) {
  try {
    console.log(`📥 Fetching: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(`❌ Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

async function scrapeFilmPosters(filmId) {
  const filmUrl = `${baseUrl}/tc/film/2025/detail/${filmId}`;
  console.log(`🎬 Scraping posters from film ${filmId}...`);
  
  const html = await fetchPage(filmUrl);
  if (!html) return [];
  
  const posters = [];
  
  // Look for swiper slides with background-image URLs
  const swiperRegex = /<div[^>]*class="[^"]*swiper-slide[^"]*"[^>]*style="[^"]*background-image:\s*url\(['"]?([^'"]+)['"]?\)[^"]*"[^>]*>/g;
  
  let match;
  while ((match = swiperRegex.exec(html)) !== null) {
    let posterUrl = match[1];
    
    // Make URL absolute if it's relative
    if (posterUrl.startsWith('/')) {
      posterUrl = `${baseUrl}${posterUrl}`;
    }
    
    // Only include /upload/film/ URLs
    if (posterUrl.includes('/upload/film/')) {
      const filename = path.basename(posterUrl).split('?')[0];
      
      posters.push({
        url: posterUrl,
        filename: filename,
        originalUrl: match[1],
        source: 'swiper-slide'
      });
    }
  }
  
  // Look for img tags with poster URLs
  const imgRegex = /<img[^>]*src="([^"]*\/upload\/film\/[^"]+)"/g;
  while ((match = imgRegex.exec(html)) !== null) {
    let posterUrl = match[1];
    
    if (posterUrl.startsWith('/')) {
      posterUrl = `${baseUrl}${posterUrl}`;
    }
    
    const filename = path.basename(posterUrl).split('?')[0];
    
    posters.push({
      url: posterUrl,
      filename: filename,
      originalUrl: match[1],
      source: 'img-tag'
    });
  }
  
  // Look for any other background-image references
  const bgImageRegex = /background-image:\s*url\(['"]?([^'"]*\/upload\/film\/[^'"]+)['"]?\)/g;
  while ((match = bgImageRegex.exec(html)) !== null) {
    let posterUrl = match[1];
    
    if (posterUrl.startsWith('/')) {
      posterUrl = `${baseUrl}${posterUrl}`;
    }
    
    const filename = path.basename(posterUrl).split('?')[0];
    
    posters.push({
      url: posterUrl,
      filename: filename,
      originalUrl: match[1],
      source: 'background-image'
    });
  }
  
  // Remove duplicates based on URL
  const uniquePosters = posters.filter((poster, index, self) => 
    index === self.findIndex(p => p.url === poster.url)
  );
  
  console.log(`   Found ${uniquePosters.length} unique poster URLs`);
  return uniquePosters;
}

async function downloadPoster(poster, filmId) {
  const filename = `${filmId}_${poster.filename}`;
  const filepath = path.join(outputDir, filename);
  
  try {
    console.log(`📥 Downloading ${filename}...`);
    
    const response = await fetch(poster.url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(filepath, buffer);
    
    const fileSizeKB = Math.round(buffer.length / 1024);
    console.log(`✅ ${filename} downloaded (${fileSizeKB} KB)`);
    
    return { 
      success: true, 
      filename, 
      size: fileSizeKB, 
      url: poster.url,
      filmId,
      source: poster.source
    };
  } catch (error) {
    console.error(`❌ Failed to download ${filename}: ${error.message}`);
    return { 
      success: false, 
      filename, 
      error: error.message, 
      url: poster.url,
      filmId,
      source: poster.source
    };
  }
}

async function downloadKnownPosters() {
  console.log('\n🎯 Phase 1: Downloading known poster URLs...\n');
  
  const results = [];
  
  for (const posterPath of knownPosterUrls) {
    const filename = path.basename(posterPath).split('?')[0];
    const url = `${baseUrl}${posterPath}`;
    
    const result = await downloadPoster({
      url,
      filename,
      originalUrl: posterPath,
      source: 'known-url'
    }, 'known');
    
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

async function scrapeAllKnownFilms() {
  console.log('\n🎯 Phase 2: Scraping posters from known film pages...\n');
  
  const allPosters = [];
  
  // Scrape posters from each known film page
  for (const filmId of knownFilmIds) {
    const posters = await scrapeFilmPosters(filmId);
    
    posters.forEach(poster => {
      allPosters.push({
        ...poster,
        filmId
      });
    });
    
    // Small delay between film page requests
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  // Remove duplicate posters based on URL
  const uniquePosters = allPosters.filter((poster, index, self) => 
    index === self.findIndex(p => p.url === poster.url)
  );
  
  console.log(`\n📊 Found ${uniquePosters.length} unique poster URLs from ${knownFilmIds.length} films`);
  
  return uniquePosters;
}

async function scrapeAllFilms() {
  // Phase 1: Download known posters
  const knownResults = await downloadKnownPosters();
  
  // Phase 2: Scrape from known film pages
  const uniquePosters = await scrapeAllKnownFilms();
  
  console.log('\n🎯 Phase 3: Downloading scraped posters...\n');
  
  const scrapedResults = [];
  
  // Download all unique posters from film pages
  for (const poster of uniquePosters) {
    const result = await downloadPoster(poster, poster.filmId);
    scrapedResults.push(result);
    
    // Small delay between downloads
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  const allResults = [...knownResults, ...scrapedResults];
  
  console.log('\n📊 Final Scraping Summary:');
  console.log('========================');
  
  const successful = allResults.filter(r => r.success);
  const failed = allResults.filter(r => !r.success);
  
  console.log(`✅ Successfully downloaded: ${successful.length}`);
  console.log(`❌ Failed downloads: ${failed.length}`);
  console.log(`🎬 Total films processed: ${knownFilmIds.length}`);
  console.log(`🖼️  Total unique posters found: ${uniquePosters.length + knownPosterUrls.length}`);
  
  if (successful.length > 0) {
    console.log('\n📁 Downloaded files:');
    successful.forEach(result => {
      console.log(`   - ${result.filename} (${result.size} KB) - Film ${result.filmId} - ${result.source}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n💥 Failed downloads:');
    failed.forEach(result => {
      console.log(`   - ${result.filename}: ${result.error} - Film ${result.filmId}`);
    });
  }
  
  const totalSize = successful.reduce((sum, r) => sum + r.size, 0);
  console.log(`\n📦 Total size: ${totalSize} KB`);
  console.log(`🎉 Comprehensive HKAFF poster scraping complete!`);
  console.log(`📁 Files saved to: ${outputDir}`);
  
  // Create comprehensive metadata file
  const metadata = {
    scrapedAt: new Date().toISOString(),
    source: baseUrl,
    knownFilmIds: knownFilmIds,
    totalFilms: knownFilmIds.length,
    totalUniquePosters: uniquePosters.length + knownPosterUrls.length,
    successfulDownloads: successful.length,
    failedDownloads: failed.length,
    totalSizeKB: totalSize,
    posters: allResults.map(result => ({
      filename: result.filename,
      success: result.success,
      size: result.size || null,
      url: result.url,
      filmId: result.filmId,
      source: result.source,
      error: result.error || null
    }))
  };
  
  const metadataFile = path.join(outputDir, 'comprehensive-metadata.json');
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  console.log(`📋 Comprehensive metadata saved to: ${metadataFile}`);
}

// Run the comprehensive scraper
scrapeAllFilms().catch(console.error);

