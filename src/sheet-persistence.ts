import { log } from './utils/logger';
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

export function getNextOpenableSheet(): SheetConfig | null {
  const openableSheets = getUserFlag('openableSheets') as SheetConfig[] | null;

  if (!openableSheets) {
    return null;
  }

  log(`available sheets: [${openableSheets.map((sheet) => sheet.id)}]`);

  let sheet = null;

  while (!sheet && openableSheets.length) {
    sheet = openableSheets.shift();

    // enforce sheet expiry - we don't want a failed sheet open
    // from 2 weeks ago to suddenly appear at today's session start
    if (
      sheet &&
      sheet.created &&
      sheet.created < Date.now() - SHEET_EXPIRY_TIMEOUT_MS
    ) {
      sheet = null;
    }
  }

  setUserFlag('openableSheets', openableSheets);

  return sheet || null;
}

export function addOpenableSheet(config: SheetConfig) {
  let openableSheets = getUserFlag('openableSheets') as SheetConfig[] | null;

  config.created = Date.now();

  if (openableSheets) {
    openableSheets.push(config);
  } else {
    openableSheets = [config];
  }

  log(`sheets now: [${openableSheets.map((sheet) => sheet.id)}]`);

  setUserFlag('openableSheets', openableSheets);
}
