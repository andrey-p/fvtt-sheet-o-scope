import WindowMode from '../enums/window-mode';

function getWindowMode(urlString: string): WindowMode {
  const url = new URL(urlString);

  if (url.searchParams.get('sheetView')) {
    return WindowMode.Secondary;
  }

  return WindowMode.Main;
}

export { getWindowMode };
