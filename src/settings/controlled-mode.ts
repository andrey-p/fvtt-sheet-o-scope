const config: SettingConfig<string> = {
  namespace: 'sheet-o-scope',
  key: 'controlledMode',
  name: 'SHEET-O-SCOPE.controlledMode',
  hint: 'SHEET-O-SCOPE.controlledModeDescription',
  scope: 'client',
  config: true,
  type: String,
  choices: {
    'controlled': 'SHEET-O-SCOPE.controlledModeControlled',
    'uncontrolled': 'SHEET-O-SCOPE.controlledModeUncontrolled'
  },
  default: 'controlled'
};

export default config;
