/**
 * Contract Tests: Data Schema Validation (T014-T017)
 *
 * These tests verify that the JSON data files conform to the defined schema.
 * Tests MUST FAIL if:
 * - Data files are missing or malformed
 * - Data doesn't match the JSON Schema specification
 * - Required fields are missing
 * - Data types are incorrect
 */

import { describe, test, expect, beforeAll } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize AJV with format validation
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Load the JSON Schema
const schemaPath = join(process.cwd(), 'specs/001-given-this-film/contracts/data-schema.json');
const dataDir = join(process.cwd(), 'frontend/public/data');

let schema: any;
let filmsData: any;
let screeningsData: any;
let venuesData: any;
let categoriesData: any;

beforeAll(() => {
  // Load schema
  const schemaContent = readFileSync(schemaPath, 'utf-8');
  schema = JSON.parse(schemaContent);

  // Load data files
  try {
    filmsData = JSON.parse(readFileSync(join(dataDir, 'films.json'), 'utf-8'));
  } catch (error) {
    filmsData = null;
  }

  try {
    screeningsData = JSON.parse(readFileSync(join(dataDir, 'screenings.json'), 'utf-8'));
  } catch (error) {
    screeningsData = null;
  }

  try {
    venuesData = JSON.parse(readFileSync(join(dataDir, 'venues.json'), 'utf-8'));
  } catch (error) {
    venuesData = null;
  }

  try {
    categoriesData = JSON.parse(readFileSync(join(dataDir, 'categories.json'), 'utf-8'));
  } catch (error) {
    categoriesData = null;
  }
});

describe('T014: Film Schema Validation', () => {
  test('films.json should exist and be valid JSON', () => {
    expect(filmsData, 'films.json file should exist and be parseable').not.toBeNull();
  });

  test('films.json should be an array', () => {
    expect(Array.isArray(filmsData), 'films.json should contain an array').toBe(true);
  });

  test('films.json should contain at least one film', () => {
    expect(filmsData?.length, 'films.json should have at least one film').toBeGreaterThan(0);
  });

  test('all films should conform to Film schema', () => {
    const filmSchema = schema.definitions.Film;
    const validate = ajv.compile(filmSchema);

    filmsData?.forEach((film: any, index: number) => {
      const valid = validate(film);
      if (!valid) {
        console.error(`Film ${index} validation errors:`, validate.errors);
      }
      expect(valid, `Film at index ${index} should match Film schema`).toBe(true);
    });
  });

  test('all film IDs should match pattern "film-[0-9]+"', () => {
    const pattern = /^film-[0-9]+$/;
    filmsData?.forEach((film: any, index: number) => {
      expect(film.id, `Film ${index} ID should match pattern`).toMatch(pattern);
    });
  });

  test('all film runtime_minutes should be positive integers', () => {
    filmsData?.forEach((film: any, index: number) => {
      expect(film.runtime_minutes, `Film ${index} runtime should be a number`).toBeTypeOf('number');
      expect(film.runtime_minutes, `Film ${index} runtime should be >= 1`).toBeGreaterThanOrEqual(1);
      expect(Number.isInteger(film.runtime_minutes), `Film ${index} runtime should be an integer`).toBe(true);
    });
  });
});

describe('T015: Screening Schema Validation', () => {
  test('screenings.json should exist and be valid JSON', () => {
    expect(screeningsData, 'screenings.json file should exist and be parseable').not.toBeNull();
  });

  test('screenings.json should be an array', () => {
    expect(Array.isArray(screeningsData), 'screenings.json should contain an array').toBe(true);
  });

  test('screenings.json should contain at least one screening', () => {
    expect(screeningsData?.length, 'screenings.json should have at least one screening').toBeGreaterThan(0);
  });

  test('all screenings should conform to Screening schema', () => {
    const screeningSchema = schema.definitions.Screening;
    const validate = ajv.compile(screeningSchema);

    screeningsData?.forEach((screening: any, index: number) => {
      const valid = validate(screening);
      if (!valid) {
        console.error(`Screening ${index} validation errors:`, validate.errors);
      }
      expect(valid, `Screening at index ${index} should match Screening schema`).toBe(true);
    });
  });

  test('all screening IDs should match pattern "screening-[0-9]+"', () => {
    const pattern = /^screening-[0-9]+$/;
    screeningsData?.forEach((screening: any, index: number) => {
      expect(screening.id, `Screening ${index} ID should match pattern`).toMatch(pattern);
    });
  });

  test('all screening film_ids should match pattern "film-[0-9]+"', () => {
    const pattern = /^film-[0-9]+$/;
    screeningsData?.forEach((screening: any, index: number) => {
      expect(screening.film_id, `Screening ${index} film_id should match pattern`).toMatch(pattern);
    });
  });

  test('all screening venue_ids should match pattern "venue-[0-9]+"', () => {
    const pattern = /^venue-[0-9]+$/;
    screeningsData?.forEach((screening: any, index: number) => {
      expect(screening.venue_id, `Screening ${index} venue_id should match pattern`).toMatch(pattern);
    });
  });

  test('all screening datetimes should be valid ISO 8601 format', () => {
    screeningsData?.forEach((screening: any, index: number) => {
      const date = new Date(screening.datetime);
      expect(date.toString(), `Screening ${index} datetime should be valid`).not.toBe('Invalid Date');
    });
  });
});

describe('T016: Venue Schema Validation', () => {
  test('venues.json should exist and be valid JSON', () => {
    expect(venuesData, 'venues.json file should exist and be parseable').not.toBeNull();
  });

  test('venues.json should be an array', () => {
    expect(Array.isArray(venuesData), 'venues.json should contain an array').toBe(true);
  });

  test('venues.json should contain at least one venue', () => {
    expect(venuesData?.length, 'venues.json should have at least one venue').toBeGreaterThan(0);
  });

  test('all venues should conform to Venue schema', () => {
    const venueSchema = schema.definitions.Venue;
    const validate = ajv.compile(venueSchema);

    venuesData?.forEach((venue: any, index: number) => {
      const valid = validate(venue);
      if (!valid) {
        console.error(`Venue ${index} validation errors:`, validate.errors);
      }
      expect(valid, `Venue at index ${index} should match Venue schema`).toBe(true);
    });
  });

  test('all venue IDs should match pattern "venue-[0-9]+"', () => {
    const pattern = /^venue-[0-9]+$/;
    venuesData?.forEach((venue: any, index: number) => {
      expect(venue.id, `Venue ${index} ID should match pattern`).toMatch(pattern);
    });
  });

  test('all venues should have non-empty names', () => {
    venuesData?.forEach((venue: any, index: number) => {
      expect(venue.name_tc, `Venue ${index} name_tc should not be empty`).toBeTruthy();
      expect(venue.name_en, `Venue ${index} name_en should not be empty`).toBeTruthy();
    });
  });
});

describe('T017: Category Schema Validation', () => {
  test('categories.json should exist and be valid JSON', () => {
    expect(categoriesData, 'categories.json file should exist and be parseable').not.toBeNull();
  });

  test('categories.json should be an array', () => {
    expect(Array.isArray(categoriesData), 'categories.json should contain an array').toBe(true);
  });

  test('categories.json should contain at least one category', () => {
    expect(categoriesData?.length, 'categories.json should have at least one category').toBeGreaterThan(0);
  });

  test('all categories should conform to Category schema', () => {
    const categorySchema = schema.definitions.Category;
    const validate = ajv.compile(categorySchema);

    categoriesData?.forEach((category: any, index: number) => {
      const valid = validate(category);
      if (!valid) {
        console.error(`Category ${index} validation errors:`, validate.errors);
      }
      expect(valid, `Category at index ${index} should match Category schema`).toBe(true);
    });
  });

  test('all category IDs should match pattern "category-[0-9]+"', () => {
    const pattern = /^category-[0-9]+$/;
    categoriesData?.forEach((category: any, index: number) => {
      expect(category.id, `Category ${index} ID should match pattern`).toMatch(pattern);
    });
  });

  test('all categories should have non-negative sort_order', () => {
    categoriesData?.forEach((category: any, index: number) => {
      expect(category.sort_order, `Category ${index} sort_order should be a number`).toBeTypeOf('number');
      expect(category.sort_order, `Category ${index} sort_order should be >= 0`).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(category.sort_order), `Category ${index} sort_order should be an integer`).toBe(true);
    });
  });

  test('all category sort_orders should be unique', () => {
    const sortOrders = categoriesData?.map((c: any) => c.sort_order) || [];
    const uniqueSortOrders = new Set(sortOrders);
    expect(uniqueSortOrders.size, 'All category sort_orders should be unique').toBe(sortOrders.length);
  });
});
