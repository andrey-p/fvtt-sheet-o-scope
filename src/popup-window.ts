import { log, warn } from './utils/logger';
import { getEntitySheet } from './utils/foundry';

import EntityType from './enums/entity-type.ts';

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

  constructor(config: PopUpConfig) {
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
      log(`Opening sheet for ${type} with ID: ${id}`);
      sheet.render(true);
    } else {
      warn(`Couldn't find sheet for ${type} with ID: ${id}`);
    }
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

    const button = new ReattachButton();

    button.onclick = () => {
      this.#reattachSheet(type, id);
    };
    buttons.unshift(button);
  }

  #reattachSheet(type: EntityType, id: string): void {
    this.#crossWindowComms.send('reattach', { id, type });

    window.close();
  }
}

export default PopUpWindow;
