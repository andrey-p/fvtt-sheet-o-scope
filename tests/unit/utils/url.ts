import { describe, test, expect } from 'vitest';
import { getWindowMode, getSheetId } from '../../../src/utils/url';
import WindowMode from '../../../src/enums/window-mode';

describe('utils/url', () => {
  describe('getWindowMode', () => {
    test('gets main window mode correctly', () => {
      expect(getWindowMode('http://localhost:30000/game')).toBe(
        WindowMode.Main
      );
    });
    test('gets popup window mode correctly', () => {
      expect(getWindowMode('http://localhost:30000/game?sheetView=1')).toBe(
        WindowMode.PopUp
      );
    });
  });

  describe('getSheetId', () => {
    test('gets sheetId correctly', () => {
      expect(
        getSheetId('http://localhost:30000/game?sheetView=1&sheetId=abcde')
      ).toBe('abcde');
      expect(getSheetId('http://localhost:30000/game')).toBe(null);
    });
  });
});
