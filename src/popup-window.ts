import { log, warn } from './utils/logger';
import { getGame } from './utils/ts-utils';

import CrossWindowComms from './cross-window-comms';
import ReattachButton from './ui/reattach-button';

import BlockUnnecessaryNotificationsShim from './shims/block-unnecessary-notifications';
import BlockUnnecessaryUiShim from './shims/block-unnecessary-ui';
import DisableCanvasShim from './shims/disable-canvas';

const shims = [
  BlockUnnecessaryNotificationsShim,
  BlockUnnecessaryUiShim,
  DisableCanvasShim
];

class PopUpWindow {
  #sheetId: string;
  #crossWindowComms: CrossWindowComms;

  constructor(sheetId: string) {
    this.#sheetId = sheetId;
    this.#crossWindowComms = new CrossWindowComms(window.opener);

    Hooks.once('init', this.#setUpShims.bind(this));
    Hooks.once('ready', this.#renderSheet.bind(this));
    Hooks.on(
      'getActorSheetHeaderButtons',
      this.#modifyHeaderSheetButtons.bind(this)
    );
  }

  #setUpShims(): void {
    shims.forEach((Shim) => {
      const shim = new Shim();
      shim.run();
    });
  }

  #renderSheet(): void {
    const game = getGame();
    const sheet = game.actors?.get(this.#sheetId)?.sheet;

    if (sheet) {
      log(`Opening sheet for actor with ID: ${this.#sheetId}`);
      sheet.render(true);
    } else {
      warn(`Couldn't find sheet for actor with ID: ${this.#sheetId}`);
    }
  }

  #modifyHeaderSheetButtons(
    sheet: ActorSheet,
    buttons: Application.HeaderButton[]
  ): void {
    const button = new ReattachButton();
    button.onclick = () => {
      this.#reattachSheet(sheet);
    };
    buttons.unshift(button);
  }

  #reattachSheet(sheet: ActorSheet): void {
    this.#crossWindowComms.send('reattach', { sheetId: sheet.document.id });

    window.close();
  }
}

export default PopUpWindow;
