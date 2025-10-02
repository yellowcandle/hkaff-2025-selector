#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real poster URLs found on the official HKAFF website
const realPosterUrls = [
  '/upload/film/6154da433f8472b7b24572968d1ef85f.png?v22',
  '/upload/film/Another-World.jpg?v22',
  '/upload/film/8bff3d4b44933e875217e5d7a8b89776.png?v22'
];

const baseUrl = 'https://www.hkaff.asia';
const outputDir = path.join(__dirname, 'hkaff-real-posters');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 Starting HKAFF real poster scraping...');
console.log(`📁 Output directory: ${outputDir}`);
console.log(`🌐 Base URL: ${baseUrl}`);

async function downloadPoster(posterPath, filename) {
  const url = `${baseUrl}${posterPath}`;
  const filepath = path.join(outputDir, filename);
  
  try {
    console.log(`📥 Downloading ${filename}...`);
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(filepath, buffer);
    
    const fileSizeKB = Math.round(buffer.length / 1024);
    console.log(`✅ ${filename} downloaded (${fileSizeKB} KB)`);
    
    return { success: true, filename, size: fileSizeKB, url };
  } catch (error) {
    console.error(`❌ Failed to download ${filename}: ${error.message}`);
    return { success: false, filename, error: error.message, url };
  }
}

async function scrapeAllPosters() {
  console.log(`\n🎯 Scraping ${realPosterUrls.length} real HKAFF posters...\n`);
  
  const results = [];
  
  for (const posterPath of realPosterUrls) {
    // Extract filename from path, removing query parameters
    const filename = path.basename(posterPath).split('?')[0];
    const result = await downloadPoster(posterPath, filename);
    results.push(result);
    
    // Small delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
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
      console.log(`   - ${result.filename} (${result.size} KB)`);
      console.log(`     URL: ${result.url}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n💥 Failed downloads:');
    failed.forEach(result => {
      console.log(`   - ${result.filename}: ${result.error}`);
      console.log(`     URL: ${result.url}`);
    });
  }
  
  const totalSize = successful.reduce((sum, r) => sum + r.size, 0);
  console.log(`\n📦 Total size: ${totalSize} KB`);
  console.log(`🎉 HKAFF poster scraping complete! Files saved to: ${outputDir}`);
  
  // Also create a metadata file with information about the posters
  const metadata = {
    scrapedAt: new Date().toISOString(),
    source: 'https://www.hkaff.asia',
    totalPosters: realPosterUrls.length,
    successful: successful.length,
    failed: failed.length,
    posters: results.map(result => ({
      filename: result.filename,
      success: result.success,
      size: result.size || null,
      url: result.url,
      error: result.error || null
    }))
  };
  
  const metadataFile = path.join(outputDir, 'metadata.json');
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  console.log(`📋 Metadata saved to: ${metadataFile}`);
}

// Run the scraper
scrapeAllPosters().catch(console.error);

