import { getWindowMode, getSheetId } from './utils/url.js';

import MainWindow from './main-window.ts';
import PopUpWindow from './popup-window.ts';

const url = window.location.toString();
const windowMode = getWindowMode(url);
const sheetId = getSheetId(url);

// this module has two entry points, one for the main window
// and one for the popup that this module opens
if (windowMode === WindowMode.Main) {
  // the main window mostly just adds a detach button to the sheets
  new MainWindow();
} else {
  // the popup window is a bit heavier - it shows the sheet in question
  // but also attempts to strip away lots of stuff that we don't need
  new PopUpWindow(sheetId);
}

CONFIG.debug.hooks = true;
