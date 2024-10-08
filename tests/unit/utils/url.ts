import { describe, test, expect } from 'vitest';
import { getWindowMode } from '../../../src/utils/url';
import WindowMode from '../../../src/enums/window-mode';

describe('utils/url', () => {
  describe('getWindowMode', () => {
    test('gets main window mode correctly', () => {
      expect(getWindowMode('http://localhost:30000/game')).toBe(
        WindowMode.Main
      );
    });
    test('gets secondary window mode correctly', () => {
      expect(getWindowMode('http://localhost:30000/game?sheetView=1')).toBe(
        WindowMode.Secondary
      );
    });
  });
});
