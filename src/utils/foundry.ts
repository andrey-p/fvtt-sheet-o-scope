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
//
// The values need to be encoded as JSON otherwise trying to use this
// as a simple key/value store leads to some really unexpected behaviour
// see: https://foundryvtt.wiki/en/development/guides/handling-data#some-details-about-setflag-and-objects

export async function getUserFlag(key: string): Promise<any> {
  const game = getGame();
  const thisUser = game.users?.current;

  if (thisUser) {
    const flag = await thisUser.getFlag('sheet-o-scope', key);

    try {
      return JSON.parse(flag as string);
    } catch {}
  }

  return null;
}

export async function setUserFlag(key: string, val: any): Promise<void> {
  const game = getGame();
  const thisUser = game.users?.current;

  if (thisUser) {
    await thisUser.setFlag('sheet-o-scope', key, JSON.stringify(val));
  }
}

export function l(key: string): string {
  const game = getGame();

  if (!game || !game.i18n || !game.i18n.localize) {
    throw new Error('this helper can only be used after Foundry\'s initialized');
  }

  return game.i18n.localize(key);
}
