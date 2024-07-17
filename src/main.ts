import { log } from './utils/logger';
import { getWindowMode } from './utils/url.js';

import MainWindow from './main-window.ts';

import PopupRenderer from './popup-renderer.ts';

const popupRenderer = new PopupRenderer(window.location);

const windowMode = getWindowMode(window.location.toString());

if (windowMode === WindowMode.Main) {
  new MainWindow();
} else {
  // TODO
}

Hooks.once('init', () => {
  if (popupRenderer.isSheetOScopeWindow()) {
    log('we\'re in a sheet-o-scope popup - taking over foundry');

    popupRenderer.hijack();
  }
});

Hooks.once('ready', () => {
  log('ready! setting up sheets');

  if (popupRenderer.isSheetOScopeWindow()) {
    popupRenderer.renderSheet();
  }
});

CONFIG.debug.hooks = true;
