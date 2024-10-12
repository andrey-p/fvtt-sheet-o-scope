import { getUserFlag, setUserFlag } from './utils/foundry';

// Module that persists openable sheets using the Foundry flag feature
//
// Because flags persist between game sessions and this module is intended for
// up to the duration of individual game sessions, we need to be extra careful with these
//
// Sheets are also handled on a first in / first out basis
// in order to account for someone opening multiple sheets at a time
// while the secondary window is still loading

const SHEET_EXPIRY_TIMEOUT_MS = 5 * 60 * 1000; // 5 mins

export async function getNextOpenableSheets(): Promise<SheetConfig[]> {
  const allOpenableSheets =
    (await getUserFlag('openableSheets') as SheetConfig[]) || [];
  const validOpenableSheets: SheetConfig[] = [];

  let sheetConfig: SheetConfig | undefined;
  while (allOpenableSheets.length) {
    sheetConfig = allOpenableSheets.shift();

    // enforce sheet expiry - we don't want a failed sheet open
    // from 2 weeks ago to suddenly appear at today's session start
    if (
      sheetConfig &&
      sheetConfig.created &&
      sheetConfig.created > Date.now() - SHEET_EXPIRY_TIMEOUT_MS
    ) {
      validOpenableSheets.push(sheetConfig);
    }
  }

  await setUserFlag('openableSheets', allOpenableSheets);

  return validOpenableSheets;
}

export async function addOpenableSheet(sheetConfig: SheetConfig): Promise<void> {
  let openableSheets = await getUserFlag('openableSheets') as SheetConfig[] | null;

  sheetConfig.created = Date.now();

  if (openableSheets) {
    openableSheets.push(sheetConfig);
  } else {
    openableSheets = [sheetConfig];
  }

  await setUserFlag('openableSheets', openableSheets);
}
