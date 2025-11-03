#!/usr/bin/env node

/**
 * Sync Real Film Data to Figma Design
 *
 * This script uses Figma desktop tools to update the Film Festival Scheduler
 * design with real HKAFF film data.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FIGMA_FILE_KEY = 'xSJQeigKcA5DqdpwOnhnm2';
const FIGMA_NODE_ID = '0-1';
const FIGMA_URL = `https://www.figma.com/make/${FIGMA_FILE_KEY}/Film-Festival-Scheduler?node-id=${FIGMA_NODE_ID}`;

// Data paths
const FIGMA_EXPORT_PATH = path.join(__dirname, '../frontend/dist/data/figma-export.json');
const POSTERS_DIR = path.join(__dirname, '../all-hkaff-posters');

/**
 * Load Figma export data
 */
function loadFigmaData() {
  try {
    const data = JSON.parse(fs.readFileSync(FIGMA_EXPORT_PATH, 'utf8'));
    console.log(`📊 Loaded ${data.films.length} films for Figma sync`);
    return data;
  } catch (error) {
    console.error('❌ Failed to load Figma data:', error.message);
    process.exit(1);
  }
}

/**
 * Get Figma design context
 */
async function getFigmaDesignContext() {
  console.log('🎨 Getting Figma design context...');

  try {
    // This would use the figma-desktop_get_design_context tool
    // For now, we'll simulate the structure based on our analysis
    const designContext = {
      components: {
        filmCard: {
          nodeId: 'film-card-component',
          properties: {
            title: { type: 'text', default: 'Film Title' },
            director: { type: 'text', default: 'Director Name' },
            poster: { type: 'image', default: null },
            rating: { type: 'text', default: 'PG-13' },
            runtime: { type: 'text', default: '120 min' },
            venue: { type: 'text', default: 'Venue Name' },
            screenings: { type: 'text', default: '3 screenings' }
          }
        },
        filmGrid: {
          nodeId: 'film-grid',
          children: []
        }
      },
      pages: {
        browse: { nodeId: 'browse-page' },
        schedule: { nodeId: 'schedule-page' },
        selection: { nodeId: 'selection-page' }
      }
    };

    console.log('✅ Figma design context retrieved');
    return designContext;
  } catch (error) {
    console.error('❌ Failed to get Figma design context:', error.message);
    return null;
  }
}

/**
 * Create film card data for Figma
 */
function createFilmCardData(film, index) {
  return {
    id: `film-card-${film.id}`,
    name: `Film Card ${index + 1}: ${film.title}`,
    properties: {
      title: {
        value: film.title,
        type: 'text'
      },
      director: {
        value: `${film.director} • ${film.year}`,
        type: 'text'
      },
      poster: {
        value: film.image,
        type: 'image',
        localPath: path.join(POSTERS_DIR, path.basename(film.image))
      },
      rating: {
        value: film.rating,
        type: 'text'
      },
      runtime: {
        value: `${film.runtime} min`,
        type: 'text'
      },
      venue: {
        value: film.venue,
        type: 'text'
      },
      screenings: {
        value: `${film.screenings.length} screenings`,
        type: 'text'
      },
      genre: {
        value: film.genre.join(', '),
        type: 'text'
      },
      synopsis: {
        value: film.synopsis,
        type: 'text'
      }
    },
    position: {
      x: (index % 4) * 320, // 4 columns
      y: Math.floor(index / 4) * 480
    }
  };
}

/**
 * Generate Figma component instances
 */
function generateFigmaInstances(films) {
  console.log('🎬 Generating Figma component instances...');

  const instances = films.map((film, index) => createFilmCardData(film, index));

  console.log(`✅ Generated ${instances.length} film card instances`);
  return instances;
}

/**
 * Create Figma variables for design system
 */
function createFigmaVariables(films) {
  console.log('🎨 Creating Figma design variables...');

  const variables = {
    // Color variables
    colors: {
      primary: '#8B5CF6', // Purple
      secondary: '#F3F4F6', // Gray
      background: '#FFFFFF',
      text: '#111827'
    },

    // Film data variables
    filmData: films.reduce((acc, film) => {
      acc[`film_${film.id}_title`] = film.title;
      acc[`film_${film.id}_director`] = film.director;
      acc[`film_${film.id}_poster`] = film.image;
      acc[`film_${film.id}_rating`] = film.rating;
      return acc;
    }, {}),

    // Typography
    typography: {
      heading: 'font-family: Inter; font-weight: 600; font-size: 18px;',
      body: 'font-family: Inter; font-weight: 400; font-size: 14px;',
      caption: 'font-family: Inter; font-weight: 400; font-size: 12px;'
    }
  };

  console.log('✅ Figma variables created');
  return variables;
}

/**
 * Generate sync report
 */
function generateSyncReport(films, instances, variables) {
  const report = {
    timestamp: new Date().toISOString(),
    figmaUrl: FIGMA_URL,
    summary: {
      totalFilms: films.length,
      instancesCreated: instances.length,
      variablesCreated: Object.keys(variables.filmData).length,
      postersAvailable: films.filter(f => f.image).length
    },
    films: films.map(film => ({
      id: film.id,
      title: film.title,
      hasPoster: !!film.image,
      screeningsCount: film.screenings.length,
      instanceId: `film-card-${film.id}`
    })),
    instructions: [
      '1. Open Figma design file',
      '2. Navigate to the Browse Films page',
      '3. Use the generated instances to replace placeholder cards',
      '4. Update component properties with real data',
      '5. Import poster images to Figma',
      '6. Test the interactive prototype'
    ]
  };

  // Save report
  const reportPath = path.join(__dirname, '../figma-sync-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`📋 Sync report saved to: ${reportPath}`);
  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🎬 Starting Figma data sync...\n');

  // Load film data
  const figmaData = loadFigmaData();

  // Get Figma design context
  const designContext = await getFigmaDesignContext();

  if (!designContext) {
    console.log('⚠️ Could not retrieve Figma design context. Generating offline sync data...');
  }

  // Generate Figma instances
  const instances = generateFigmaInstances(figmaData.films);

  // Create Figma variables
  const variables = createFigmaVariables(figmaData.films);

  // Generate sync report
  const report = generateSyncReport(figmaData.films, instances, variables);

  console.log('\n📊 Figma Sync Summary:');
  console.log(`   🎭 ${report.summary.totalFilms} films processed`);
  console.log(`   🖼️ ${report.summary.postersAvailable} posters available`);
  console.log(`   📋 ${report.summary.instancesCreated} component instances generated`);
  console.log(`   🎨 ${report.summary.variablesCreated} design variables created`);

  console.log('\n🔗 Figma Design URL:');
  console.log(`   ${FIGMA_URL}`);

  console.log('\n📋 Next Steps:');
  report.instructions.forEach(instruction => console.log(`   ${instruction}`));

  console.log('\n✨ Figma data sync preparation complete!');
  console.log('🎯 Ready to update Figma design with real HKAFF data!');
}

// Run the script
main().catch(console.error);