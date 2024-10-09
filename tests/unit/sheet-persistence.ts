import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  addOpenableSheet,
  getNextOpenableSheets
} from '../../src/sheet-persistence';

vi.mock('../../src/utils/foundry', () => {
  const fakeStore = {};

  return {
    getUserFlag: (key) => fakeStore[key] || null,
    setUserFlag: (key, val) => (fakeStore[key] = val)
  };
});

describe('sheet-persistence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('adding and removing sheets to storage', () => {
    expect(getNextOpenableSheets()).toMatchObject([]);

    addOpenableSheet({ id: 'abc', type: 'actor' });
    addOpenableSheet({ id: 'def', type: 'journal' });

    expect(getNextOpenableSheets()).toMatchObject([
      { id: 'abc', type: 'actor', created: expect.any(Number) },
      { id: 'def', type: 'journal', created: expect.any(Number) }
    ]);
    expect(getNextOpenableSheets()).toMatchObject([]);
  });

  test('sheet expiry', () => {
    expect(getNextOpenableSheets()).toMatchObject([]);

    addOpenableSheet({ id: 'abc', type: 'actor' });

    // fast forward 10 mins
    vi.advanceTimersByTime(10 * 60 * 1000);

    addOpenableSheet({ id: 'def', type: 'journal' });

    expect(getNextOpenableSheets()).toMatchObject([
      { id: 'def', type: 'journal' }
    ]);
    expect(getNextOpenableSheets()).toMatchObject([]);
  });
});
