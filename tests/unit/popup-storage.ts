import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  addOpenablePopUp,
  getNextOpenablePopUp
} from '../../src/popup-storage';

vi.mock('../../src/utils/foundry', () => {
  const fakeStore = {};

  return {
    getUserFlag: (key) => fakeStore[key] || null,
    setUserFlag: (key, val) => (fakeStore[key] = val)
  };
});

describe('popup-storage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('adding and removing popups to storage', () => {
    expect(getNextOpenablePopUp()).toBeNull();

    addOpenablePopUp({ id: 'abc', type: 'actor' });
    addOpenablePopUp({ id: 'def', type: 'journal' });

    expect(getNextOpenablePopUp()).toMatchObject({ id: 'abc', type: 'actor' });
    expect(getNextOpenablePopUp()).toMatchObject({
      id: 'def',
      type: 'journal'
    });
    expect(getNextOpenablePopUp()).toBeNull();
  });

  test('popup expiry', () => {
    expect(getNextOpenablePopUp()).toBeNull();

    addOpenablePopUp({ id: 'abc', type: 'actor' });

    // fast forward 10 mins
    vi.advanceTimersByTime(10 * 60 * 1000);

    addOpenablePopUp({ id: 'def', type: 'journal' });

    expect(getNextOpenablePopUp()).toMatchObject({
      id: 'def',
      type: 'journal'
    });
    expect(getNextOpenablePopUp()).toBeNull();
  });
});
