import { ControlledMode } from '../enums';

const config: SettingConfig<string> = {
  namespace: 'sheet-o-scope',
  key: 'controlledMode',
  name: 'SHEET-O-SCOPE.controlledMode',
  hint: 'SHEET-O-SCOPE.controlledModeDescription',
  scope: 'client',
  config: true,
  type: String,
  choices: {
    [ControlledMode.Controlled]: 'SHEET-O-SCOPE.controlledModeControlled',
    [ControlledMode.Uncontrolled]: 'SHEET-O-SCOPE.controlledModeUncontrolled'
  },
  default: 'controlled'
};

export default config;
