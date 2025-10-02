#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Based on the pattern you found: /upload/film/6154da433f8472b7b24572968d1ef85f.png?v22
// These appear to be hashed filenames, so we'll need to discover them from the website

const baseUrl = 'https://hkaff2025.herballemon.dev';
const outputDir = path.join(__dirname, 'real-posters');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 Starting real film poster scraping...');
console.log(`📁 Output directory: ${outputDir}`);

// Known poster URLs from your example
const knownPosterUrls = [
  '/upload/film/6154da433f8472b7b24572968d1ef85f.png?v22'
];

// We'll also try to discover more by checking the film data
const filmIds = [
  'film-101', 'film-102', 'film-103', 'film-104', 'film-105',
  'film-106', 'film-107', 'film-108', 'film-109', 'film-110'
];

async function downloadPoster(posterPath, filename) {
  const url = `${baseUrl}${posterPath}`;
  const filepath = path.join(outputDir, filename);
  
  try {
    console.log(`📥 Downloading ${filename}...`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(filepath, buffer);
    
    const fileSizeKB = Math.round(buffer.length / 1024);
    console.log(`✅ ${filename} downloaded (${fileSizeKB} KB)`);
    
    return { success: true, filename, size: fileSizeKB };
  } catch (error) {
    console.error(`❌ Failed to download ${filename}: ${error.message}`);
    return { success: false, filename, error: error.message };
  }
}

async function discoverPostersFromFilmData() {
  console.log('\n🔍 Attempting to discover poster URLs from film data...');
  
  const discoveredUrls = [];
  
  // Try to fetch the film data JSON files that might contain poster URLs
  const possibleDataUrls = [
    '/data/films.json',
    '/api/films',
    '/films.json',
    '/data/films.js'
  ];
  
  for (const dataUrl of possibleDataUrls) {
    try {
      console.log(`🔍 Checking ${dataUrl}...`);
      const response = await fetch(`${baseUrl}${dataUrl}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`📋 Found data at ${dataUrl}`);
        
        // Look for poster URLs in the data
        const searchForPosterUrls = (obj) => {
          if (typeof obj === 'string' && obj.includes('/upload/film/')) {
            discoveredUrls.push(obj);
          } else if (typeof obj === 'object' && obj !== null) {
            Object.values(obj).forEach(searchForPosterUrls);
          }
        };
        
        searchForPosterUrls(data);
      }
    } catch (error) {
      // Silently continue if this URL doesn't exist
    }
  }
  
  return [...new Set(discoveredUrls)]; // Remove duplicates
}

async function scrapeKnownPosters() {
  console.log('\n📥 Downloading known poster URLs...');
  
  const results = [];
  
  for (const posterPath of knownPosterUrls) {
    const filename = path.basename(posterPath).split('?')[0]; // Remove query params
    const result = await downloadPoster(posterPath, filename);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return results;
}

async function scrapeRealPosters() {
  console.log(`\n🎯 Scraping real film posters...\n`);
  
  // First, try to discover more poster URLs
  const discoveredUrls = await discoverPostersFromFilmData();
  
  if (discoveredUrls.length > 0) {
    console.log(`🔍 Discovered ${discoveredUrls.length} additional poster URLs:`);
    discoveredUrls.forEach(url => console.log(`   - ${url}`));
  }
  
  // Combine known and discovered URLs
  const allUrls = [...knownPosterUrls, ...discoveredUrls];
  
  // Download known posters
  const knownResults = await scrapeKnownPosters();
  
  // Download discovered posters
  const discoveredResults = [];
  for (const posterPath of discoveredUrls) {
    const filename = path.basename(posterPath).split('?')[0];
    const result = await downloadPoster(posterPath, filename);
    discoveredResults.push(result);
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  const allResults = [...knownResults, ...discoveredResults];
  
  console.log('\n📊 Scraping Summary:');
  console.log('==================');
  
  const successful = allResults.filter(r => r.success);
  const failed = allResults.filter(r => !r.success);
  
  console.log(`✅ Successfully downloaded: ${successful.length}`);
  console.log(`❌ Failed downloads: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n📁 Downloaded files:');
    successful.forEach(result => {
      console.log(`   - ${result.filename} (${result.size} KB)`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n💥 Failed downloads:');
    failed.forEach(result => {
      console.log(`   - ${result.filename}: ${result.error}`);
    });
  }
  
  const totalSize = successful.reduce((sum, r) => sum + r.size, 0);
  console.log(`\n📦 Total size: ${totalSize} KB`);
  console.log(`🎉 Real poster scraping complete! Files saved to: ${outputDir}`);
  
  if (successful.length === 0) {
    console.log('\n💡 Tips for finding more poster URLs:');
    console.log('   1. Check the browser developer tools for network requests');
    console.log('   2. Look for API endpoints that return film data');
    console.log('   3. Inspect the HTML source for background-image styles');
    console.log('   4. Check for JavaScript files that might contain poster URLs');
  }
}

// Run the scraper
scrapeRealPosters().catch(console.error);

