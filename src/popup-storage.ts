import { log } from './utils/logger';
import { getUserFlag, setUserFlag } from './utils/foundry';

// Module that persists popups using the Foundry flag feature
//
// Because flags persist between game sessions and this module is intended for
// up to the duration of individual game sessions, we need to be extra careful with these
//
// Popups are also handled on a last in / first out basis
// in order to account for someone opening multiple popups at a time

const POPUP_EXPIRY_TIMEOUT_MS = 5 * 60 * 1000; // 5 mins

export function getNextOpenablePopUp(): PopUpConfig | null {
  const popUps = getUserFlag('popUps') as PopUpConfig[] | null;

  if (!popUps) {
    return null;
  }

  log(`available popups: [${popUps.map((popUp) => popUp.id)}]`);

  let popUp = null;

  while (!popUp && popUps.length) {
    popUp = popUps.shift();

    // enforce popup expiry - we don't want a failed popup open
    // from 2 weeks ago to suddenly appear at today's session start
    if (
      popUp &&
      popUp.created &&
      popUp.created < Date.now() - POPUP_EXPIRY_TIMEOUT_MS
    ) {
      popUp = null;
    }
  }

  setUserFlag('popUps', popUps);

  return popUp || null;
}

export function addOpenablePopUp(config: PopUpConfig) {
  let popUps = getUserFlag('popUps') as PopUpConfig[] | null;

  config.created = Date.now();

  if (popUps) {
    popUps.push(config);
  } else {
    popUps = [config];
  }

  log(`popups now: [${popUps.map((popUp) => popUp.id)}]`);

  setUserFlag('popUps', popUps);
}
