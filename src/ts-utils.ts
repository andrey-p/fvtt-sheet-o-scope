// the types provided by fountry-vtt-types have guards in place for Foundry entities that may not have loaded
// by the time code runs, so they need to be type guarded
//
// see: https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/10
export function getGame() {
  return game as Game;
}
