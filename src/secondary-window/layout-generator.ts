const REASONABLE_SHEET_WIDTH: number = 700;

class LayoutGenerator {
  #currentViewportRect: Rect;
  #availWidth: number;

  constructor(initialViewportRect: Rect, availWidth: number) {
    this.#currentViewportRect = initialViewportRect;
    this.#availWidth = availWidth;
  }

  resizeViewport(newViewportRect: Rect): void {
    this.#currentViewportRect = newViewportRect;
  }

  getLayout(sheets: FormApplication[]): SecondaryWindowLayout {
    const viewportHeight = this.#currentViewportRect.height;
    let totalSheetWidth = 0;
    const sheetRects: Rect[] = [];

    sheets.forEach((sheet) => {
      // sheet.options hopefully gives us the sheet's original, intended dimensions
      // we try to preserve the width and shrink/expand the height to match the viewport
      const sheetWidth = sheet.options.width || REASONABLE_SHEET_WIDTH;

      sheetRects.push({
        x: totalSheetWidth,
        y: 0,
        width: sheetWidth,
        height: viewportHeight
      });

      totalSheetWidth += sheetWidth;
    });

    // don't allow the secondary window to extend outside of the screen
    let viewportWidth = Math.min(totalSheetWidth, this.#availWidth);

    // give the viewport a nominal width in case no sheets were passed
    if (viewportWidth === 0) {
      viewportWidth = REASONABLE_SHEET_WIDTH;
    }

    return {
      viewport: {
        width: viewportWidth,
        height: viewportHeight
      },
      sheets: sheetRects
    };
  }
}

export default LayoutGenerator;
