import { getGame, l } from '../utils/foundry';

import controlledMode from './controlled-mode';
import stickyMode from './sticky-mode';

const registerSetting = async (config: SettingConfig<string>) => {
  const game = getGame();

  // Foundry's i18n isn't available immediately,
  // and we can only translate certain bits
  // once the settings are being registered
  // hence why these user-facing strings only get wrapped here

  if (config.name) {
    config.name = l(config.name);
  }

  if (config.hint) {
    config.hint = l(config.hint);
  }

  if (config.choices) {
    for (const key in config.choices) {
      config.choices[key] = l(config.choices[key]);
    }
  }

  await game.settings.register('sheet-o-scope', config.key, config);
};

export const registerSettings = async () => {
  await registerSetting(controlledMode);
  await registerSetting(stickyMode);
};
