#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Film IDs from the website (film-101 to film-110 based on what we observed)
const filmIds = [
  'film-101', 'film-102', 'film-103', 'film-104', 'film-105',
  'film-106', 'film-107', 'film-108', 'film-109', 'film-110'
];

const baseUrl = 'https://hkaff2025.herballemon.dev/posters/';
const outputDir = path.join(__dirname, 'scraped-posters');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 Starting film poster scraping...');
console.log(`📁 Output directory: ${outputDir}`);

async function downloadPoster(filmId) {
  const url = `${baseUrl}${filmId}.jpg`;
  const filename = `${filmId}.jpg`;
  const filepath = path.join(outputDir, filename);
  
  try {
    console.log(`📥 Downloading ${filmId}...`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(filepath, buffer);
    
    const fileSizeKB = Math.round(buffer.length / 1024);
    console.log(`✅ ${filmId} downloaded (${fileSizeKB} KB)`);
    
    return { success: true, filmId, size: fileSizeKB };
  } catch (error) {
    console.error(`❌ Failed to download ${filmId}: ${error.message}`);
    return { success: false, filmId, error: error.message };
  }
}

async function scrapeAllPosters() {
  console.log(`\n🎯 Scraping ${filmIds.length} film posters...\n`);
  
  const results = [];
  
  for (const filmId of filmIds) {
    const result = await downloadPoster(filmId);
    results.push(result);
    
    // Small delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Scraping Summary:');
  console.log('==================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successfully downloaded: ${successful.length}`);
  console.log(`❌ Failed downloads: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n📁 Downloaded files:');
    successful.forEach(result => {
      console.log(`   - ${result.filmId}.jpg (${result.size} KB)`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n💥 Failed downloads:');
    failed.forEach(result => {
      console.log(`   - ${result.filmId}: ${result.error}`);
    });
  }
  
  const totalSize = successful.reduce((sum, r) => sum + r.size, 0);
  console.log(`\n📦 Total size: ${totalSize} KB`);
  console.log(`🎉 Scraping complete! Files saved to: ${outputDir}`);
}

// Run the scraper
scrapeAllPosters().catch(console.error);

