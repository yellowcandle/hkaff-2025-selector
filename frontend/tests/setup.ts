/**
 * Vitest Setup File
 * Sets up test environment with mocks and polyfills
 */

import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

// Assign to global
global.localStorage = localStorageMock as Storage;

// Reset localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

// Mock fetch for data loading tests
global.fetch = vi.fn((url: string) => {
  // Mock successful JSON responses
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => {
      // Return empty arrays for test data
      if (url.includes('films.json')) return [];
      if (url.includes('screenings.json')) return [];
      if (url.includes('venues.json')) return [];
      if (url.includes('categories.json')) return [];
      return [];
    }
  } as Response);
}) as typeof fetch;