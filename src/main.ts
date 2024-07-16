import { log } from './utils/logger';
import { getGame } from './utils/ts-utils';

import SheetHandler from './sheet-handler.ts';
import PopupRenderer from './popup-renderer.ts';

const sheetHandler = new SheetHandler();
const popupRenderer = new PopupRenderer(window.location);

Hooks.once('init', () => {
  if (popupRenderer.isSheetOScopeWindow()) {
    log('we\'re in a sheet-o-scope popup - taking over foundry');

    popupRenderer.hijack();
  }
});

Hooks.once('ready', () => {
  log('ready! setting up sheets');

  const game = getGame();

  sheetHandler.init();

  if (popupRenderer.isSheetOScopeWindow()) {
    popupRenderer.renderSheet();
  }

  // lib-wrapper is needed to patch into Foundry code -
  // bother the GM until it's installed and enabled
  if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
    ui.notifications?.error(
      'Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.'
    );
  }
});

CONFIG.debug.hooks = true;
