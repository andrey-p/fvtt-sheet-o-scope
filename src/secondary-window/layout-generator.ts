const REASONABLE_SHEET_WIDTH: number = 700;

class LayoutGenerator {
  #currentViewportRect: Rect;
  #availWidth: number;
  #manuallyResized: boolean;

  constructor(initialViewportRect: Rect, availWidth: number) {
    this.#currentViewportRect = initialViewportRect;
    this.#availWidth = availWidth;
    this.#manuallyResized = false;
  }

  resizeViewport(newViewportRect: Rect): void {
    this.#currentViewportRect = newViewportRect;
    this.#manuallyResized = true;
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

    let viewportWidth: number;

    // if the secondary window was manually resized,
    // stick to whatever the user wants
    if (this.#manuallyResized) {
      viewportWidth = this.#currentViewportRect.width;
    } else {
      // otherwise, expand based on total sheet width
      // being careful not to let the secondary window extend outside of the screen
      viewportWidth = Math.min(totalSheetWidth, this.#availWidth);

      // give the viewport a nominal width in case no sheets were passed
      if (viewportWidth === 0) {
        viewportWidth = REASONABLE_SHEET_WIDTH;
      }
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
