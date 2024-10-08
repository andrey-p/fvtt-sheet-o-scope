import { getWindowMode } from './utils/url';

import WindowMode from './enums/window-mode';

import MainWindow from './main-window';
import SecondaryWindow from './secondary-window';

const url = window.location.toString();
const windowMode = getWindowMode(url);

// this module has two entry points, one for the main window
// and one for the secondary window that this module opens
if (windowMode === WindowMode.Main) {
  // the main window mostly just adds a detach button to the sheets
  new MainWindow();
} else if (windowMode === WindowMode.Secondary) {
  // the secondary window is a bit heavier - it shows the sheets in question
  // but also attempts to strip away lots of foundry UI that we don't need
  new SecondaryWindow();
}
