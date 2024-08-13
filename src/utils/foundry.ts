import EntityType from '../enums/entity-type';

// certain types provided by fountry-vtt-types have guards in place for Foundry entities that may not have loaded
// by the time code runs, so they need to be type guarded
//
// see: https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/10
export function getGame() {
  return game as Game;
}

export function getEntitySheet(
  id: string,
  type: EntityType
): FormApplication | null | undefined {
  const game = getGame();

  if (type === EntityType.Actor) {
    return game.actors?.get(id)?.sheet;
  } else if (type === EntityType.Item) {
    return game.items?.get(id)?.sheet;
  } else if (type === EntityType.Journal) {
    return game.journal?.get(id)?.sheet;
  }
}

// Use Foundry flags to persist a variety of things
// see: https://foundryvtt.com/api/classes/foundry.abstract.Document.html#setFlag

export function getUserFlag(key: string): any {
  const game = getGame();
  const thisUser = game.users?.current;

  if (thisUser) {
    return thisUser.getFlag('sheet-o-scope', key);
  }

  return null;
}

export function setUserFlag(key: string, val: any) {
  const game = getGame();
  const thisUser = game.users?.current;

  if (thisUser) {
    thisUser.setFlag('sheet-o-scope', key, val);
  }
}
