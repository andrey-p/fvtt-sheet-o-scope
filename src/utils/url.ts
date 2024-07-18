import WindowMode from '../enums/window-mode';

function getWindowMode(urlString: string): WindowMode {
  const url = new URL(urlString);

  if (url.searchParams.get('sheetView')) {
    return WindowMode.PopUp;
  }

  return WindowMode.Main;
}

function getSheetId(urlString: string): string | null {
  const url = new URL(urlString);

  return url.searchParams.get('sheetId');
}

export { getWindowMode, getSheetId };
