import WindowMode from '../enums/window-mode';
import EntityType from '../enums/entity-type';

function getWindowMode(urlString: string): WindowMode {
  const url = new URL(urlString);

  if (url.searchParams.get('sheetView')) {
    return WindowMode.PopUp;
  }

  return WindowMode.Main;
}

function getPopUpConfig(urlString: string): PopUpConfig | null {
  const url = new URL(urlString);
  const search = url.searchParams;

  if (search.get('sheetView')) {
    const id = search.get('id');
    const type = search.get('type');

    if (id && type && Object.values(EntityType).includes(type as EntityType)) {
      return { id, type };
    }
  }

  return null;
}

export { getWindowMode, getPopUpConfig };
