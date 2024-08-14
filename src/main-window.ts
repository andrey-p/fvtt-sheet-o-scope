import { log } from './utils/logger';
import { getGame, getEntitySheet } from './utils/foundry';
import { addOpenablePopUp } from './popup-storage';

import { EntityType, CrossWindowAction } from './enums';

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

    Hooks.on(
      'getActorSheetHeaderButtons',
      this.#modifySheetHeaderButtons.bind(this, EntityType.Actor)
    );
    Hooks.on(
      'getItemSheetHeaderButtons',
      this.#modifySheetHeaderButtons.bind(this, EntityType.Item)
    );
    Hooks.on(
      'getJournalSheetHeaderButtons',
      this.#modifySheetHeaderButtons.bind(this, EntityType.Journal)
    );

    this.#crossWindowComms.addEventListener(
      'message',
      this.#onMessageReceived.bind(this) as EventListener
    );
  }

  #onMessageReceived(event: CrossWindowMessageEvent): void {
    const eventData = event.data;

    if (eventData.action === CrossWindowAction.Reattach) {
      this.#reattachSheet(eventData.data);
    }
  }

  #modifySheetHeaderButtons(
    type: EntityType,
    sheet: DocumentSheet,
    buttons: Application.HeaderButton[]
  ): void {
    const button = new DetachButton();
    button.onclick = () => {
      this.#detachSheet(type, sheet);
    };
    buttons.unshift(button);
  }

  #detachSheet(type: EntityType, sheet: DocumentSheet): void {
    const { width, height } = sheet.options;
    const id = sheet.document.id;

    if (!id) {
      return;
    }

    addOpenablePopUp({ id, type });

    sheet.close();

    window.open(
      `/game?sheetView=1`,
      `sheet-o-scope-popup-${id}`,
      `popup=true,width=${width},height=${height}`
    );
  }

  #reattachSheet(config: PopUpConfig): void {
    const { id, type } = config;
    const sheet = getEntitySheet(id, type);

    if (sheet) {
      sheet.render(true);
    }
  }
}

export default MainWindow;
