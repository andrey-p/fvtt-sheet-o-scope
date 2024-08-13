import { log, warn } from './logger';
import { getGame } from './foundry';

// This module uses Foundry flags to persist a variety of things:
// https://foundryvtt.com/api/classes/foundry.abstract.Document.html#setFlag
//
// Because flags persist between game sessions and this module is intended for
// less than the duration of individual game sessions, we need to be extra careful

//
// Generic getter / setter helpers
//

export function get(key :string) :any {
  const game = getGame();
  const thisUser = game.users?.current;

  if (thisUser) {
    return thisUser.getFlag('sheet-o-scope', key);
  }

  warn(`couldn't retrieve ${key}`);

  return null;
}

export function set(key :string, val :any) {
  const game = getGame();
  const thisUser = game.users?.current;

  if (thisUser) {
    thisUser.setFlag('sheet-o-scope', key, val);
  }

  warn(`couldn't store ${key}`);
}

//
// Adding / retrieving popups to open
//
// These are handled on a last in / first out basis
// in order to account for someone opening multiple popups at a time

export function getNextOpenablePopUp(): PopUpConfig | null {
  const popUps = get('popUps') as PopUpConfig[] | null;

  if (!popUps) {
    return null;
  }

  log(`available popups: [${popUps.map(popUp => popUp.id)}]`);

  const popUp = popUps.shift();
  set('popUps', popUps);

  return popUp || null;
}

export function addOpenablePopUp(config: PopUpConfig) {
  let popUps = get('popUps') as PopUpConfig[] | null;

  if (popUps) {
    popUps.push(config);
  } else {
    popUps = [config];
  }

  log(`popups now: [${popUps.map(popUp => popUp.id)}]`);

  set('popUps', popUps);
}
