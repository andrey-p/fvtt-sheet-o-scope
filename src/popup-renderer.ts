import { getGame } from './ts-utils';
import { log, warn } from './logger';

class PopupRenderer {
  _sheetView: string | null;

  constructor(location: Location) {
    const searchParams = new URLSearchParams(location.search);
    // this will be an actor ID
    this._sheetView = searchParams.get('sheetView');
  }

  isSheetOScopeWindow(): boolean {
    return !!this._sheetView;
  }

  hijack(): void {
    // overwrite Foundry settings to disable canvas rendering in the popup window
    // for a solid performance boost
    libWrapper.register('sheet-o-scope', 'ClientSettings.prototype.get', function (fn: Function, ...args: any[]) {
      if (args.join('.') === 'core.noCanvas') {
        return true;
      }

      return fn(...args);
    });
  }

  renderSheet(): void {
    if (!this._sheetView) {
      return;
    }

    // render the actor's sheet that was passed to the popup
    const game = getGame();
    const sheet = game.actors?.get(this._sheetView)?.sheet;

    if (sheet) {
      log(`Opening sheet for actor with ID: ${this._sheetView}`);
      sheet.render(true);
    } else {
      warn(`Couldn't find sheet for actor with ID: ${this._sheetView}`);
    }
  }
}

export default PopupRenderer;
