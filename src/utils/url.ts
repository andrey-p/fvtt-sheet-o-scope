function getWindowMode(urlString: string): WindowMode {
  const url = new URL(urlString);

  if (url.searchParams.get('sheetView')) {
    return WindowMode.PopUp;
  }

  return WindowMode.Main;
}

export { getWindowMode };
