import { StickyMode } from '../enums';

const config: SettingConfig<string> = {
  namespace: 'sheet-o-scope',
  key: 'stickyMode',
  name: 'SHEET-O-SCOPE.stickyMode',
  hint: 'SHEET-O-SCOPE.stickyModeDescription',
  scope: 'client',
  config: true,
  type: String,
  choices: {
    [StickyMode.Normal]: 'SHEET-O-SCOPE.stickyModeNormal',
    [StickyMode.Sticky]: 'SHEET-O-SCOPE.stickyModeSticky'
  },
  default: 'normal'
};

export default config;
