const isDev = import.meta.env.MODE === 'development';

if (isDev) {
  CONFIG.debug.hooks = true;
}

function log(msg: string): void {
  if (isDev) {
    console.log(`sheet-o-scope | ${msg}`);
  }
}

function warn(msg: string): void {
  if (isDev) {
    console.warn(`sheet-o-scope | ${msg}`);
  }
}

export { log, warn };
