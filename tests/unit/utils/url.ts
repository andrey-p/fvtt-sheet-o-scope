import { describe, test, expect } from 'vitest';
import { getWindowMode, getPopUpConfig } from '../../../src/utils/url';
import WindowMode from '../../../src/enums/window-mode';

describe('utils/url', () => {
  describe('getWindowMode', () => {
    test('gets main window mode correctly', () => {
      expect(getWindowMode('http://localhost:30000/game')).toBe(
        WindowMode.PopUp
      );
    });
    test('gets popup window mode correctly', () => {
      expect(getWindowMode('http://localhost:30000/game?sheetView=1')).toBe(
        WindowMode.PopUp
      );
    });
  });

  describe('getPopUpConfig', () => {
    test('gets correctly formed popup config', () => {
      const result = getPopUpConfig(
        'http://localhost:30000/game?sheetView=1&id=abcde&type=actor'
      );

      expect(result).toMatchObject({ id: 'abcde', type: 'actor' });
    });

    test.each([
      ['sheetView=1&type=actor'],
      ['id=abcde&type=actor'],
      ['sheetView=1&id=abcde'],
      ['sheetView=1&id=abcde&type=wrong']
    ])('returns null for malformed config: %s', (search) => {
      const result = getPopUpConfig(`http://localhost:30000/game?${search}`);

      expect(result).toBeNull();
    });
  });
});
