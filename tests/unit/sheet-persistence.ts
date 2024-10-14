import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  addOpenableSheet,
  getNextOpenableSheets
} from '../../src/sheet-persistence';

vi.mock('../../src/utils/foundry', () => {
  const fakeStore = {};

  return {
    getUserFlag: (key) => Promise.resolve(fakeStore[key] || null),
    setUserFlag: (key, val) => Promise.resolve((fakeStore[key] = val))
  };
});

describe('sheet-persistence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('adding and removing sheets to storage', async () => {
    expect(await getNextOpenableSheets()).toMatchObject([]);

    await addOpenableSheet({ id: 'abc', type: 'actor' });
    await addOpenableSheet({ id: 'def', type: 'journal' });

    expect(await getNextOpenableSheets()).toMatchObject([
      { id: 'abc', type: 'actor', created: expect.any(Number) },
      { id: 'def', type: 'journal', created: expect.any(Number) }
    ]);
    expect(await getNextOpenableSheets()).toMatchObject([]);
  });

  test('sheet expiry', async () => {
    expect(await getNextOpenableSheets()).toMatchObject([]);

    await addOpenableSheet({ id: 'abc', type: 'actor' });

    // fast forward 10 mins
    vi.advanceTimersByTime(10 * 60 * 1000);

    await addOpenableSheet({ id: 'def', type: 'journal' });

    expect(await getNextOpenableSheets()).toMatchObject([
      { id: 'def', type: 'journal' }
    ]);
    expect(await getNextOpenableSheets()).toMatchObject([]);
  });
});
