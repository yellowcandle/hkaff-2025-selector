/**
 * Contract Tests: Service Interface Validation (T018-T022)
 *
 * These tests verify that service implementations conform to the defined interfaces.
 * Tests MUST FAIL initially because services are NOT YET IMPLEMENTED.
 *
 * Each test checks:
 * 1. Service class exists
 * 2. Required methods exist
 * 3. Methods have correct signatures (parameter count, return types)
 * 4. Methods behave according to contract
 */

import { describe, test, expect, beforeEach } from 'vitest';
import type {
  IDataLoader,
  IStorageService,
  IConflictDetector,
  IMarkdownExporter,
  IScheduleService,
  Film,
  Screening,
  Venue,
  Category,
  UserSelection,
  Conflict,
} from '../../specs/001-given-this-film/contracts/service-interfaces';

// These imports will fail until implementations exist
// This is EXPECTED and REQUIRED for TDD

let DataLoader: new () => IDataLoader;
let StorageService: new () => IStorageService;
let ConflictDetector: new () => IConflictDetector;
let MarkdownExporter: new () => IMarkdownExporter;
let ScheduleService: new (
  storage: IStorageService,
  conflictDetector: IConflictDetector
) => IScheduleService;

// Attempt to import implementations (will fail initially - this is expected)
try {
  const dataLoaderModule = await import('../../frontend/src/services/dataLoader');
  DataLoader = dataLoaderModule.DataLoader;
} catch (error) {
  // Expected to fail - service not implemented yet
}

try {
  const storageModule = await import('../../frontend/src/services/storageService');
  StorageService = storageModule.StorageService;
} catch (error) {
  // Expected to fail - service not implemented yet
}

try {
  const conflictModule = await import('../../frontend/src/services/conflictDetector');
  ConflictDetector = conflictModule.ConflictDetector;
} catch (error) {
  // Expected to fail - service not implemented yet
}

try {
  const exporterModule = await import('../../frontend/src/services/markdownExporter');
  MarkdownExporter = exporterModule.MarkdownExporter;
} catch (error) {
  // Expected to fail - service not implemented yet
}

try {
  const scheduleModule = await import('../../frontend/src/services/scheduleService');
  ScheduleService = scheduleModule.ScheduleService;
} catch (error) {
  // Expected to fail - service not implemented yet
}

describe('T018: IDataLoader Interface Contract', () => {
  test('DataLoader class should be defined', () => {
    expect(DataLoader, 'DataLoader class is not implemented yet').toBeDefined();
  });

  test('DataLoader should be instantiable', () => {
    expect(() => new DataLoader(), 'DataLoader should be constructable').not.toThrow();
  });

  test('loadFilms() method should exist', () => {
    const loader = new DataLoader();
    expect(loader.loadFilms, 'loadFilms method should exist').toBeDefined();
    expect(typeof loader.loadFilms, 'loadFilms should be a function').toBe('function');
  });

  test('loadFilms() should return Promise<Film[]>', async () => {
    const loader = new DataLoader();
    const result = loader.loadFilms();
    expect(result, 'loadFilms should return a Promise').toBeInstanceOf(Promise);

    const films = await result;
    expect(Array.isArray(films), 'loadFilms should resolve to an array').toBe(true);
  });

  test('loadScreenings() method should exist', () => {
    const loader = new DataLoader();
    expect(loader.loadScreenings, 'loadScreenings method should exist').toBeDefined();
    expect(typeof loader.loadScreenings, 'loadScreenings should be a function').toBe('function');
  });

  test('loadScreenings() should return Promise<Screening[]>', async () => {
    const loader = new DataLoader();
    const result = loader.loadScreenings();
    expect(result, 'loadScreenings should return a Promise').toBeInstanceOf(Promise);

    const screenings = await result;
    expect(Array.isArray(screenings), 'loadScreenings should resolve to an array').toBe(true);
  });

  test('loadVenues() method should exist', () => {
    const loader = new DataLoader();
    expect(loader.loadVenues, 'loadVenues method should exist').toBeDefined();
    expect(typeof loader.loadVenues, 'loadVenues should be a function').toBe('function');
  });

  test('loadVenues() should return Promise<Venue[]>', async () => {
    const loader = new DataLoader();
    const result = loader.loadVenues();
    expect(result, 'loadVenues should return a Promise').toBeInstanceOf(Promise);

    const venues = await result;
    expect(Array.isArray(venues), 'loadVenues should resolve to an array').toBe(true);
  });

  test('loadCategories() method should exist', () => {
    const loader = new DataLoader();
    expect(loader.loadCategories, 'loadCategories method should exist').toBeDefined();
    expect(typeof loader.loadCategories, 'loadCategories should be a function').toBe('function');
  });

  test('loadCategories() should return Promise<Category[]>', async () => {
    const loader = new DataLoader();
    const result = loader.loadCategories();
    expect(result, 'loadCategories should return a Promise').toBeInstanceOf(Promise);

    const categories = await result;
    expect(Array.isArray(categories), 'loadCategories should resolve to an array').toBe(true);
  });

  test('loadAll() method should exist', () => {
    const loader = new DataLoader();
    expect(loader.loadAll, 'loadAll method should exist').toBeDefined();
    expect(typeof loader.loadAll, 'loadAll should be a function').toBe('function');
  });

  test('loadAll() should return Promise with all data', async () => {
    const loader = new DataLoader();
    const result = loader.loadAll();
    expect(result, 'loadAll should return a Promise').toBeInstanceOf(Promise);

    const data = await result;
    expect(data, 'loadAll should return an object').toBeTypeOf('object');
    expect(Array.isArray(data.films), 'loadAll().films should be an array').toBe(true);
    expect(Array.isArray(data.screenings), 'loadAll().screenings should be an array').toBe(true);
    expect(Array.isArray(data.venues), 'loadAll().venues should be an array').toBe(true);
    expect(Array.isArray(data.categories), 'loadAll().categories should be an array').toBe(true);
  });
});

describe('T019: IStorageService Interface Contract', () => {
  test('StorageService class should be defined', () => {
    expect(StorageService, 'StorageService class is not implemented yet').toBeDefined();
  });

  test('StorageService should be instantiable', () => {
    expect(() => new StorageService(), 'StorageService should be constructable').not.toThrow();
  });

  test('getSelections() method should exist and return array', () => {
    const storage = new StorageService();
    expect(storage.getSelections, 'getSelections method should exist').toBeDefined();
    expect(typeof storage.getSelections, 'getSelections should be a function').toBe('function');

    const selections = storage.getSelections();
    expect(Array.isArray(selections), 'getSelections should return an array').toBe(true);
  });

  test('addSelection() method should exist with correct signature', () => {
    const storage = new StorageService();
    expect(storage.addSelection, 'addSelection method should exist').toBeDefined();
    expect(typeof storage.addSelection, 'addSelection should be a function').toBe('function');
    expect(storage.addSelection.length, 'addSelection should take 3 parameters').toBe(3);
  });

  test('removeSelection() method should exist and return boolean', () => {
    const storage = new StorageService();
    expect(storage.removeSelection, 'removeSelection method should exist').toBeDefined();
    expect(typeof storage.removeSelection, 'removeSelection should be a function').toBe('function');

    const result = storage.removeSelection('non-existent');
    expect(typeof result, 'removeSelection should return boolean').toBe('boolean');
  });

  test('isSelected() method should exist and return boolean', () => {
    const storage = new StorageService();
    expect(storage.isSelected, 'isSelected method should exist').toBeDefined();
    expect(typeof storage.isSelected, 'isSelected should be a function').toBe('function');

    const result = storage.isSelected('screening-1');
    expect(typeof result, 'isSelected should return boolean').toBe('boolean');
  });

  test('clearAll() method should exist', () => {
    const storage = new StorageService();
    expect(storage.clearAll, 'clearAll method should exist').toBeDefined();
    expect(typeof storage.clearAll, 'clearAll should be a function').toBe('function');
  });

  test('getLanguage() method should exist and return valid language code', () => {
    const storage = new StorageService();
    expect(storage.getLanguage, 'getLanguage method should exist').toBeDefined();
    expect(typeof storage.getLanguage, 'getLanguage should be a function').toBe('function');

    const lang = storage.getLanguage();
    expect(['tc', 'en'].includes(lang), 'getLanguage should return "tc" or "en"').toBe(true);
  });

  test('setLanguage() method should exist', () => {
    const storage = new StorageService();
    expect(storage.setLanguage, 'setLanguage method should exist').toBeDefined();
    expect(typeof storage.setLanguage, 'setLanguage should be a function').toBe('function');
  });

  test('exportData() method should exist and return LocalStorageSchema', () => {
    const storage = new StorageService();
    expect(storage.exportData, 'exportData method should exist').toBeDefined();
    expect(typeof storage.exportData, 'exportData should be a function').toBe('function');

    const data = storage.exportData();
    expect(data, 'exportData should return an object').toBeTypeOf('object');
    expect(data.version, 'exportData should have version field').toBeDefined();
    expect(data.last_updated, 'exportData should have last_updated field').toBeDefined();
    expect(Array.isArray(data.selections), 'exportData.selections should be an array').toBe(true);
  });

  test('importData() method should exist', () => {
    const storage = new StorageService();
    expect(storage.importData, 'importData method should exist').toBeDefined();
    expect(typeof storage.importData, 'importData should be a function').toBe('function');
  });
});

describe('T020: IConflictDetector Interface Contract', () => {
  test('ConflictDetector class should be defined', () => {
    expect(ConflictDetector, 'ConflictDetector class is not implemented yet').toBeDefined();
  });

  test('ConflictDetector should be instantiable', () => {
    expect(() => new ConflictDetector(), 'ConflictDetector should be constructable').not.toThrow();
  });

  test('detectConflicts() method should exist and return array', () => {
    const detector = new ConflictDetector();
    expect(detector.detectConflicts, 'detectConflicts method should exist').toBeDefined();
    expect(typeof detector.detectConflicts, 'detectConflicts should be a function').toBe('function');

    const conflicts = detector.detectConflicts([]);
    expect(Array.isArray(conflicts), 'detectConflicts should return an array').toBe(true);
  });

  test('wouldConflict() method should exist and return array', () => {
    const detector = new ConflictDetector();
    expect(detector.wouldConflict, 'wouldConflict method should exist').toBeDefined();
    expect(typeof detector.wouldConflict, 'wouldConflict should be a function').toBe('function');
    // wouldConflict takes 2 required parameters and 2 optional parameters
    // Function.length only counts required parameters before the first optional one
    expect(detector.wouldConflict.length, 'wouldConflict should take at least 2 parameters').toBeGreaterThanOrEqual(2);
  });

  test('calculateOverlap() method should exist and return number', () => {
    const detector = new ConflictDetector();
    expect(detector.calculateOverlap, 'calculateOverlap method should exist').toBeDefined();
    expect(typeof detector.calculateOverlap, 'calculateOverlap should be a function').toBe('function');
    expect(detector.calculateOverlap.length, 'calculateOverlap should take 2 parameters').toBe(2);
  });

  test('hasOverlap() method should exist and return boolean', () => {
    const detector = new ConflictDetector();
    expect(detector.hasOverlap, 'hasOverlap method should exist').toBeDefined();
    expect(typeof detector.hasOverlap, 'hasOverlap should be a function').toBe('function');
    expect(detector.hasOverlap.length, 'hasOverlap should take 2 parameters').toBe(2);
  });
});

describe('T021: IMarkdownExporter Interface Contract', () => {
  test('MarkdownExporter class should be defined', () => {
    expect(MarkdownExporter, 'MarkdownExporter class is not implemented yet').toBeDefined();
  });

  test('MarkdownExporter should be instantiable', () => {
    expect(() => new MarkdownExporter(), 'MarkdownExporter should be constructable').not.toThrow();
  });

  test('exportSchedule() method should exist and return string', () => {
    const exporter = new MarkdownExporter();
    expect(exporter.exportSchedule, 'exportSchedule method should exist').toBeDefined();
    expect(typeof exporter.exportSchedule, 'exportSchedule should be a function').toBe('function');
    expect(exporter.exportSchedule.length, 'exportSchedule should take 2 parameters').toBe(2);

    const result = exporter.exportSchedule([], 'en');
    expect(typeof result, 'exportSchedule should return a string').toBe('string');
  });

  test('groupByDate() method should exist and return Map', () => {
    const exporter = new MarkdownExporter();
    expect(exporter.groupByDate, 'groupByDate method should exist').toBeDefined();
    expect(typeof exporter.groupByDate, 'groupByDate should be a function').toBe('function');

    const result = exporter.groupByDate([]);
    expect(result instanceof Map, 'groupByDate should return a Map').toBe(true);
  });

  test('formatSelection() method should exist and return string', () => {
    const exporter = new MarkdownExporter();
    expect(exporter.formatSelection, 'formatSelection method should exist').toBeDefined();
    expect(typeof exporter.formatSelection, 'formatSelection should be a function').toBe('function');
    expect(exporter.formatSelection.length, 'formatSelection should take 2 parameters').toBe(2);
  });
});

describe('T022: IScheduleService Interface Contract', () => {
  test('ScheduleService class should be defined', () => {
    expect(ScheduleService, 'ScheduleService class is not implemented yet').toBeDefined();
  });

  test('ScheduleService should be instantiable with dependencies', () => {
    // This will fail until dependencies are implemented
    if (StorageService && ConflictDetector) {
      const storage = new StorageService();
      const detector = new ConflictDetector();
      expect(
        () => new ScheduleService(storage, detector),
        'ScheduleService should be constructable with dependencies'
      ).not.toThrow();
    }
  });

  test('getGroupedSchedule() method should exist and return Map', () => {
    if (StorageService && ConflictDetector && ScheduleService) {
      const storage = new StorageService();
      const detector = new ConflictDetector();
      const service = new ScheduleService(storage, detector);

      expect(service.getGroupedSchedule, 'getGroupedSchedule method should exist').toBeDefined();
      expect(typeof service.getGroupedSchedule, 'getGroupedSchedule should be a function').toBe('function');

      const result = service.getGroupedSchedule();
      expect(result instanceof Map, 'getGroupedSchedule should return a Map').toBe(true);
    }
  });

  test('getConflicts() method should exist and return array', () => {
    if (StorageService && ConflictDetector && ScheduleService) {
      const storage = new StorageService();
      const detector = new ConflictDetector();
      const service = new ScheduleService(storage, detector);

      expect(service.getConflicts, 'getConflicts method should exist').toBeDefined();
      expect(typeof service.getConflicts, 'getConflicts should be a function').toBe('function');

      const conflicts = service.getConflicts();
      expect(Array.isArray(conflicts), 'getConflicts should return an array').toBe(true);
    }
  });

  test('getStats() method should exist and return stats object', () => {
    if (StorageService && ConflictDetector && ScheduleService) {
      const storage = new StorageService();
      const detector = new ConflictDetector();
      const service = new ScheduleService(storage, detector);

      expect(service.getStats, 'getStats method should exist').toBeDefined();
      expect(typeof service.getStats, 'getStats should be a function').toBe('function');

      const stats = service.getStats();
      expect(stats, 'getStats should return an object').toBeTypeOf('object');
      expect(typeof stats.total_selections, 'stats.total_selections should be a number').toBe('number');
      expect(typeof stats.total_conflicts, 'stats.total_conflicts should be a number').toBe('number');
      expect(Array.isArray(stats.dates), 'stats.dates should be an array').toBe(true);
      expect(stats.venues instanceof Set, 'stats.venues should be a Set').toBe(true);
    }
  });
});
