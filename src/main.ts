import { log } from './logger';
import { getGame } from './ts-utils';

Hooks.once('ready', () => {
  const game = getGame();

  // lib-wrapper is needed to patch into Foundry code -
  // bother the GM until it's installed
  if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
    ui.notifications?.error('Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.');
  }
});

log('ready!');

CONFIG.debug.hooks = true;
