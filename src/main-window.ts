import { log } from './utils/logger';
import { getGame } from './utils/ts-utils';

import CrossWindowComms from './cross-window-comms.ts';
import DetachButton from './ui/detach-button.ts';

class MainWindow extends EventTarget {
  #crossWindowComms: CrossWindowComms;

  constructor() {
    super();

    this.#crossWindowComms = new CrossWindowComms();
    Hooks.once('ready', this.#initialize.bind(this));
  }

  #initialize(): void {
    const game = getGame();

    // lib-wrapper is needed to patch into Foundry code -
    // bother the GM until it's installed and enabled,
    // otherwise sheet-o-scope can't do its thing
    if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
      ui.notifications?.error(
        'Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.'
      );

      return;
    }

    log('Setting up changes to main window');

    Hooks.on('getActorSheetHeaderButtons', this.#modifySheetHeaderButtons.bind(this));
    this.#crossWindowComms.addEventListener(
      'message',
      this.#onMessageReceived.bind(this) as EventListener
    );
  }

  #onMessageReceived(event: CrossWindowMessageEvent): void {
    if (event.data.action === 'reattach' && event.data.sheetId) {
      this.#reattachSheet(event.data.sheetId);
    }
  }

  #modifySheetHeaderButtons(
    sheet: ActorSheet,
    buttons: Application.HeaderButton[]
  ): void {
    const button = new DetachButton();
    button.onclick = () => {
      this.#detachSheet(sheet);
    };
    buttons.unshift(button);
  }

  #detachSheet(sheet: ActorSheet): void {
    const { width, height } = sheet.options;
    const id = sheet.document.id;

    sheet.close();

    window.open(
      `/game?sheetView=${id}`,
      '_blank',
      `popup=true,width=${width},height=${height}`
    );
  }

  #reattachSheet(sheetId: string): void {
    const game = getGame();
    game.actors?.get(sheetId)?.sheet?.render(true);
  }
}

export default MainWindow;
