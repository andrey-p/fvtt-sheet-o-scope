const config: SettingConfig<string> = {
  namespace: 'sheet-o-scope',
  key: 'stickyMode',
  name: 'SHEET-O-SCOPE.stickyMode',
  hint: 'SHEET-O-SCOPE.stickyModeDescription',
  scope: 'client',
  config: true,
  type: String,
  choices: {
    'normal': 'SHEET-O-SCOPE.stickyModeNormal',
    'sticky': 'SHEET-O-SCOPE.stickyModeSticky'
  },
  default: 'normal'
};

export default config;
