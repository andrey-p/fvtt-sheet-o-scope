import { describe, test, expect } from 'vitest';
import LayoutGenerator from '../../../src/secondary-window/layout-generator';

describe('secondary-window/layout-generator', () => {
  describe('getLayout', () => {
    test('generates valid layout for no sheets passed', () => {
      const layoutGenerator = new LayoutGenerator(
        { width: 500, height: 700 },
        1200
      );

      const layout = layoutGenerator.getLayout([]);

      expect(layout.viewport.width).toBeGreaterThan(0);
      expect(layout.viewport.height).toBeGreaterThan(0);
      expect(layout.sheets.length).toBe(0);
    });
    test('generates valid layout for 1+ sheets passed', () => {
      const layoutGenerator = new LayoutGenerator(
        { width: 500, height: 700 },
        1200
      );

      let layout = layoutGenerator.getLayout([
        { options: { width: 600, height: 800 } }
      ]);

      expect(layout.viewport.width).toBe(600);
      expect(layout.viewport.height).toBe(700);
      expect(layout.sheets.length).toBe(1);
      expect(layout.sheets[0]).toMatchObject({
        x: 0,
        y: 0,
        width: 600,
        height: 700
      });

      layout = layoutGenerator.getLayout([
        { options: { width: 600, height: 800 } },
        { options: { width: 200, height: 300 } }
      ]);

      expect(layout.viewport.width).toBe(800);
      expect(layout.viewport.height).toBe(700);
      expect(layout.sheets.length).toBe(2);
      expect(layout.sheets[0]).toMatchObject({
        x: 0,
        y: 0,
        width: 600,
        height: 700
      });
      expect(layout.sheets[1]).toMatchObject({
        x: 600,
        y: 0,
        width: 200,
        height: 700
      });
    });

    test('generates valid layout for sheets that threaten to extend past the edge of the screen', () => {
      const layoutGenerator = new LayoutGenerator(
        { width: 500, height: 700 },
        1200
      );
      const layout = layoutGenerator.getLayout([
        { options: { width: 600, height: 800 } },
        { options: { width: 200, height: 300 } },
        { options: { width: 700, height: 1000 } }
      ]);

      expect(layout.viewport.width).toBe(1200);
      expect(layout.viewport.height).toBe(700);
      expect(layout.sheets.length).toBe(3);
      expect(layout.sheets[0]).toMatchObject({
        x: 0,
        y: 0,
        width: 600,
        height: 700
      });
      expect(layout.sheets[1]).toMatchObject({
        x: 600,
        y: 0,
        width: 200,
        height: 700
      });
      expect(layout.sheets[2]).toMatchObject({
        x: 800,
        y: 0,
        width: 700,
        height: 700
      });
    });
  });
});
