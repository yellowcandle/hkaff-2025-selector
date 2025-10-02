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

console.log('🎬 Starting comprehensive HKAFF poster scraping...');
console.log(`📁 Output directory: ${outputDir}`);
console.log(`🌐 Base URL: ${baseUrl}`);

async function fetchPage(url) {
  try {
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

async function scrapeFilmListPage(pageNum) {
  const url = `${baseUrl}/tc/film/2025?page=${pageNum}`;
  console.log(`📋 Scraping film list page ${pageNum}...`);
  
  const html = await fetchPage(url);
  if (!html) return [];
  
  // Extract film detail URLs from HTML
  const filmUrlRegex = /href="(\/tc\/film\/2025\/detail\/\d+)"/g;
  const titleRegex = /<a[^>]*href="\/tc\/film\/2025\/detail\/\d+"[^>]*>([^<]+)<\/a>/g;
  
  const filmUrls = [];
  const titles = [];
  
  let match;
  while ((match = filmUrlRegex.exec(html)) !== null) {
    filmUrls.push(`${baseUrl}${match[1]}`);
  }
  
  while ((match = titleRegex.exec(html)) !== null) {
    titles.push(match[1].trim());
  }
  
  // Combine URLs with titles
  const films = filmUrls.map((url, index) => ({
    title: titles[index] || `Film ${index + 1}`,
    url,
    detailId: url.split('/').pop()
  }));
  
  console.log(`✅ Found ${films.length} films on page ${pageNum}`);
  return films;
}

async function scrapeFilmPosters(filmUrl) {
  console.log(`🎬 Scraping posters from: ${filmUrl}`);
  
  const html = await fetchPage(filmUrl);
  if (!html) return [];
  
  // Look for swiper slides with background-image URLs
  const posterRegex = /background-image:\s*url\(["']?([^"']*\/upload\/film\/[^"']+)["']?\)/g;
  const posters = [];
  
  let match;
  while ((match = posterRegex.exec(html)) !== null) {
    let posterUrl = match[1];
    
    // Make URL absolute if it's relative
    if (posterUrl.startsWith('/')) {
      posterUrl = `${baseUrl}${posterUrl}`;
    }
    
    // Extract filename from URL
    const filename = path.basename(posterUrl).split('?')[0];
    
    posters.push({
      url: posterUrl,
      filename: filename,
      originalUrl: match[1]
    });
  }
  
  // Also look for img tags with poster URLs
  const imgRegex = /<img[^>]*src=["']([^"']*\/upload\/film\/[^"']+)["'][^>]*>/g;
  while ((match = imgRegex.exec(html)) !== null) {
    let posterUrl = match[1];
    
    if (posterUrl.startsWith('/')) {
      posterUrl = `${baseUrl}${posterUrl}`;
    }
    
    const filename = path.basename(posterUrl).split('?')[0];
    
    posters.push({
      url: posterUrl,
      filename: filename,
      originalUrl: match[1]
    });
  }
  
  // Remove duplicates
  const uniquePosters = posters.filter((poster, index, self) => 
    index === self.findIndex(p => p.url === poster.url)
  );
  
  console.log(`   Found ${uniquePosters.length} unique poster URLs`);
  return uniquePosters;
}

async function downloadPoster(poster, filmTitle, filmId) {
  const safeTitle = filmTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_');
  const filename = `${filmId}_${safeTitle}_${poster.filename}`;
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
      filmTitle,
      filmId
    };
  } catch (error) {
    console.error(`❌ Failed to download ${filename}: ${error.message}`);
    return { 
      success: false, 
      filename, 
      error: error.message, 
      url: poster.url,
      filmTitle,
      filmId
    };
  }
}

async function scrapeAllFilms() {
  console.log('\n🎯 Phase 1: Scraping all film URLs...\n');
  
  const allFilms = [];
  const totalPages = 7;
  
  // Scrape all film list pages
  for (let page = 1; page <= totalPages; page++) {
    const films = await scrapeFilmListPage(page);
    allFilms.push(...films);
    
    // Small delay between page requests
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Remove duplicates based on URL
  const uniqueFilms = allFilms.filter((film, index, self) => 
    index === self.findIndex(f => f.url === film.url)
  );
  
  console.log(`\n📊 Found ${uniqueFilms.length} unique films across ${totalPages} pages`);
  
  console.log('\n🎯 Phase 2: Scraping poster URLs from each film...\n');
  
  const allPosters = [];
  
  // Scrape poster URLs from each film page
  for (const film of uniqueFilms) {
    const posters = await scrapeFilmPosters(film.url);
    
    posters.forEach(poster => {
      allPosters.push({
        ...poster,
        filmTitle: film.title,
        filmId: film.detailId,
        filmUrl: film.url
      });
    });
    
    // Small delay between film page requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Remove duplicate posters based on URL
  const uniquePosters = allPosters.filter((poster, index, self) => 
    index === self.findIndex(p => p.url === poster.url)
  );
  
  console.log(`\n📊 Found ${uniquePosters.length} unique poster URLs from ${uniqueFilms.length} films`);
  
  console.log('\n🎯 Phase 3: Downloading all posters...\n');
  
  const results = [];
  
  // Download all unique posters
  for (const poster of uniquePosters) {
    const result = await downloadPoster(poster, poster.filmTitle, poster.filmId);
    results.push(result);
    
    // Small delay between downloads
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n📊 Final Scraping Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successfully downloaded: ${successful.length}`);
  console.log(`❌ Failed downloads: ${failed.length}`);
  console.log(`🎬 Total films processed: ${uniqueFilms.length}`);
  console.log(`🖼️  Total unique posters found: ${uniquePosters.length}`);
  
  if (successful.length > 0) {
    console.log('\n📁 Downloaded files:');
    successful.forEach(result => {
      console.log(`   - ${result.filename} (${result.size} KB) - ${result.filmTitle}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n💥 Failed downloads:');
    failed.forEach(result => {
      console.log(`   - ${result.filename}: ${result.error} - ${result.filmTitle}`);
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
    totalPages: totalPages,
    totalFilms: uniqueFilms.length,
    totalUniquePosters: uniquePosters.length,
    successfulDownloads: successful.length,
    failedDownloads: failed.length,
    totalSizeKB: totalSize,
    films: uniqueFilms.map(film => ({
      title: film.title,
      detailId: film.detailId,
      url: film.url
    })),
    posters: results.map(result => ({
      filename: result.filename,
      success: result.success,
      size: result.size || null,
      url: result.url,
      filmTitle: result.filmTitle,
      filmId: result.filmId,
      error: result.error || null
    }))
  };
  
  const metadataFile = path.join(outputDir, 'comprehensive-metadata.json');
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  console.log(`📋 Comprehensive metadata saved to: ${metadataFile}`);
}

// Run the comprehensive scraper
scrapeAllFilms().catch(console.error);

