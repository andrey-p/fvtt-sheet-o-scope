import { getWindowMode, getPopUpConfig } from './utils/url';

import WindowMode from './enums/window-mode';

import MainWindow from './main-window';
import PopUpWindow from './popup-window';

const url = window.location.toString();
const windowMode = getWindowMode(url);
const popUpConfig = getPopUpConfig(url);

// this module has two entry points, one for the main window
// and one for the popup that this module opens
if (windowMode === WindowMode.Main) {
  // the main window mostly just adds a detach button to the sheets
  new MainWindow();
} else if (windowMode === WindowMode.PopUp && popUpConfig) {
  // the popup window is a bit heavier - it shows the sheet in question
  // but also attempts to strip away lots of foundry UI that we don't need
  new PopUpWindow(popUpConfig);
}
