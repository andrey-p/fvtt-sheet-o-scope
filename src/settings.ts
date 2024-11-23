import { getGame, l } from './utils/foundry';

import controlledMode from './settings/controlled-mode';
import stickyMode from './settings/sticky-mode';

class Settings {
  async registerSettings(): Promise<void> {
    await this.#registerSetting(controlledMode);
    await this.#registerSetting(stickyMode);
  }

  get(key: string): string {
    const game = getGame();

    return game.settings.get('sheet-o-scope', key) as string;
  }

  async #registerSetting(config: SettingConfig<string>): Promise<void> {
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
  }
}

export default Settings;
