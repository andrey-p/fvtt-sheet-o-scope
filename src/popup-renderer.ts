import { getGame } from './ts-utils';
import { log, warn } from './logger';

type NotifyArgs = [
  string,
  string,
  //NotifyOptions
];

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

    // PopupRenderer's `this` will be inaccessible in libWrapper's callback
    // so, pop this method into local scope for the next bit
    const shouldBlockApplication = this._shouldBlockApplication;
    const shouldBlockNotification = this._shouldBlockNotification;

    // prevent any of the UI elements hidden by the popup from rendering
    // for (hopefully) a minor performance boost
    libWrapper.register('sheet-o-scope', 'Application.prototype.render', function (this: Application, fn: Function, ...args: any[]):Application {
      if (shouldBlockApplication(this)) {
        // render() chains, so return the Application doing nothing
        return this;
      }

      return fn(...args);
    });

    // prevent some default, irrelevant notifications from rendering
    libWrapper.register('sheet-o-scope', 'Notifications.prototype.notify', function (this: Notification, fn: Function, ...args: NotifyArgs):number {
      console.log(args);
      if (shouldBlockNotification(args)) {
        return -1;
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

  _shouldBlockApplication(app:Application): boolean {
    // it seems better to block specific Applications than to do
    // a blanket block and only allow certain ones through
    // - we don't want to accidentally break Applications using a specific sheet
    const idsToBlock = [
      'navigation',
      'sidebar',
      'players',
      'hotbar',
      'pause',
      'controls'
    ];

    if (idsToBlock.includes(app.options.id)) {
      return true;
    }

    return false;
  }

  _shouldBlockNotification(args:NotifyArgs): boolean {
    const [ message, type ] = args;

    // this is brittle but there doesn't seem to be a better way of targeting them
    // luckily, these seem to not be translated
    if (type === 'info' && message.includes('not displayed because the game Canvas is disabled')) {
      return true;
    }

    if (type === 'error' && message.includes('Foundry Virtual Tabletop requires a minimum screen resolution')) {
      return true;
    }

    return false;
  }
}

export default PopupRenderer;
