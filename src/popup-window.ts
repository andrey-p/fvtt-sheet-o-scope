import { log, warn } from './utils/logger';
import { getEntitySheet } from './utils/foundry';

import { EntityType, CrossWindowAction } from './enums';

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
  #crossWindowComms: CrossWindowComms;

  #isActuallyPopup: boolean;

  constructor(config: PopUpConfig) {
    // it's possible that this was opened from Foundry running in Electron
    // in which case a few of the special tweaks we want to do are unnecessary
    this.#isActuallyPopup =
      !!window.opener && window.name.includes('sheet-o-scope');

    this.#crossWindowComms = new CrossWindowComms(window.opener);

    Hooks.once('init', this.#setUpShims.bind(this));
    Hooks.once('ready', this.#renderSheet.bind(this, config));

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
    document.querySelector('body')?.classList.add('sheet-o-scope-popup');
  }

  #setUpShims(): void {
    shims.forEach((Shim) => {
      const shim = new Shim();
      shim.run();
    });
  }

  #renderSheet(config: PopUpConfig): void {
    const { id, type } = config;
    const sheet = getEntitySheet(id, type);

    if (sheet) {
      const options: any = {};

      // if this view is actually showing in a popup,
      // resizing it is done via the window
      if (this.#isActuallyPopup) {
        options.resizable = false;
      }

      // in e.g. electron, this view will show in a new browser window
      // where being able to minimize it is still irrelevant
      options.minimizable = false;

      log(`Opening sheet for ${type} with ID: ${id}`);
      sheet.render(true, options);

      window.addEventListener('resize', this.#onWindowResize.bind(this, sheet));
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

    // add reattach button only makes sense if there's an opener to send the button back to
    if (this.#isActuallyPopup) {
      const reattachButton = new ReattachButton();

      reattachButton.onclick = () => {
        this.#reattachSheet(type, id);
      };
      buttons.unshift(reattachButton);
    }
  }

  #modifySheet(_sheet: DocumentSheet, elems: Element[]): void {
    if (this.#isActuallyPopup) {
      elems[0].classList.add('popup-sheet');
    }
  }

  #reattachSheet(type: EntityType, id: string): void {
    this.#crossWindowComms.send(CrossWindowAction.Reattach, { id, type });

    window.close();
  }
}

export default PopUpWindow;
