// overwrites Foundry settings to disable canvas rendering in the popup window
// for a solid performance boost
class DisableCanvasShim implements Shim {
  run() {
    libWrapper.register('sheet-o-scope', 'ClientSettings.prototype.get', function (fn: Function, ...args: any[]) {
      if (args.join('.') === 'core.noCanvas') {
        return true;
      }

      return fn(...args);
    });
  }
}

export default DisableCanvasShim;
