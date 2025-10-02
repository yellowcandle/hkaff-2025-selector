import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import filmsData from '../../public/data/films.json' assert { type: 'json' };
import screeningsData from '../../public/data/screenings.json' assert { type: 'json' };
import venuesData from '../../public/data/venues.json' assert { type: 'json' };
import categoriesData from '../../public/data/categories.json' assert { type: 'json' };
import schema from '../../../specs/001-given-this-film/contracts/data-schema.json' assert { type: 'json' };

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

describe('HKAFF Data Schema Contract Tests', () => {
  // T014: Contract test for films.json schema
  it('T014: films.json should validate against Film schema', () => {
    const validateFilms = ajv.compile(schema.definitions.Film);
    const valid = filmsData.every(film => validateFilms(film));
    expect(valid).toBe(true); // This should fail initially if data doesn't match
    if (!valid) {
      console.log('Films validation errors:', ajv.errors);
    }
  });

  // T015: Contract test for screenings.json schema
  it('T015: screenings.json should validate against Screening schema', () => {
    const validateScreenings = ajv.compile(schema.definitions.Screening);
    const valid = screeningsData.every(screening => validateScreenings(screening));
    expect(valid).toBe(true); // This should fail initially
    if (!valid) {
      console.log('Screenings validation errors:', ajv.errors);
    }
  });

  // T016: Contract test for venues.json schema
  it('T016: venues.json should validate against Venue schema', () => {
    const validateVenues = ajv.compile(schema.definitions.Venue);
    const valid = venuesData.every(venue => validateVenues(venue));
    expect(valid).toBe(true); // This should fail initially
    if (!valid) {
      console.log('Venues validation errors:', ajv.errors);
    }
  });

  // T017: Contract test for categories.json schema
  it('T017: categories.json should validate against Category schema', () => {
    const validateCategories = ajv.compile(schema.definitions.Category);
    const valid = categoriesData.every(category => validateCategories(category));
    expect(valid).toBe(true); // This should fail initially
    if (!valid) {
      console.log('Categories validation errors:', ajv.errors);
    }
  });
});