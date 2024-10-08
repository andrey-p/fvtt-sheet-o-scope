import { log, warn } from './utils/logger';
import { getEntitySheet } from './utils/foundry';
import { getNextOpenableSheet } from './sheet-persistence';

import { EntityType, SocketAction } from './enums';

import SocketHandler from './socket-handler';
import ReattachButton from './ui/reattach-button';

import BlockUnnecessaryNotificationsShim from './shims/block-unnecessary-notifications';
import BlockUnnecessaryUiShim from './shims/block-unnecessary-ui';
import DisableCanvasShim from './shims/disable-canvas';

const shims = [
  BlockUnnecessaryNotificationsShim,
  BlockUnnecessaryUiShim,
  DisableCanvasShim
];

class SecondaryWindow {
  #socketHandler?: SocketHandler;
  #isRenderedInPopup: boolean;

  constructor() {
    // it's possible that this was opened from Foundry running in Electron
    // in which case it's opened as a large-size browser tab with full browser chrome, not a popup window
    // and a few of the special tweaks we want to do are unnecessary
    this.#isRenderedInPopup =
      !!window.opener && window.name.includes('sheet-o-scope');

    Hooks.once('init', this.#setUpShims.bind(this));
    Hooks.once('ready', this.#renderSheet.bind(this));

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

    Hooks.on('renderActorSheet', this.#modifySheet.bind(this));
    Hooks.on('renderItemSheet', this.#modifySheet.bind(this));
    Hooks.on('renderJournalSheet', this.#modifySheet.bind(this));

    // add a CSS hook to the body for all sorts of minor CSS tweaks
    document.querySelector('body')?.classList.add('sheet-o-scope-secondary');
  }

  #setUpShims(): void {
    this.#socketHandler = new SocketHandler();

    shims.forEach((Shim) => {
      const shim = new Shim();
      shim.run();
    });
  }

  #renderSheet(): void {
    const config = getNextOpenableSheet();

    if (!config) {
      return;
    }

    const { id, type } = config;
    const sheet = getEntitySheet(id, type);

    if (sheet) {
      const options: any = {};

      // if this view is actually showing in a popup,
      // resizing it is done via the window
      if (this.#isRenderedInPopup) {
        options.resizable = false;

        window.addEventListener(
          'resize',
          this.#onWindowResize.bind(this, sheet)
        );
      }

      // in e.g. electron, this view will show in a new browser window
      // where being able to minimize it is still irrelevant
      options.minimizable = false;

      log(`Opening sheet for ${type} with ID: ${id}`);
      sheet.render(true, options);
    } else {
      warn(`Couldn't find sheet for ${type} with ID: ${id}`);
    }
  }

  #onWindowResize(sheet: FormApplication | null | undefined): void {
    if (!sheet) {
      return;
    }

    sheet.setPosition({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  #modifySheetHeaderButtons(
    type: EntityType,
    sheet: DocumentSheet,
    buttons: Application.HeaderButton[]
  ): void {
    const id = sheet.document.id;

    if (!id) {
      return;
    }

    // change close button so it closes the window
    // rather than just the sheet
    const closeButton = buttons.find((button) => button.class === 'close');

    if (closeButton) {
      closeButton.onclick = () => {
        window.close();
      };
    }

    // add reattach button
    const reattachButton = new ReattachButton();

    reattachButton.onclick = () => {
      this.#reattachSheet(type, id);
    };
    buttons.unshift(reattachButton);
  }

  #modifySheet(_sheet: DocumentSheet, elems: Element[]): void {
    if (this.#isRenderedInPopup) {
      elems[0].classList.add('secondary-window-sheet');
    }
  }

  #reattachSheet(type: EntityType, id: string): void {
    this.#socketHandler?.send(SocketAction.Reattach, { id, type });

    window.close();
  }
}

export default SecondaryWindow;
