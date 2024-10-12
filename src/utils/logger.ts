const isDev = import.meta.env.MODE === 'dev';

import { LogType } from '../enums';

if (isDev) {
  CONFIG.debug.hooks = true;
}

function log(type: LogType, message: string): void {
  if (!isDev) {
    return;
  }

  const logFunc = console[type];
  message = `sheet-o-scope | ${message}`;

  logFunc(message);
}

export { log };
