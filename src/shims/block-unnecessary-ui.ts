// hides certain elements of the foundry UI that would
// otherwise be hidden by the sheet
// for (hopefully) a minor performance boost
class BlockUnnecessaryUiShim implements Shim {
  run(): void {
    // the shim's `this` will be inaccessible in libWrapper's callback
    // so, pop this method into local scope for the next bit
    const shouldBlockApplication = this.#shouldBlockApplication;

    libWrapper.register(
      'sheet-o-scope',
      'Application.prototype.render',
      function (this: Application, fn: Function, ...args: any[]): Application {
        if (shouldBlockApplication(this)) {
          // Application.prototype.render() chains, so return the Application doing nothing
          return this;
        }

        return fn(...args);
      }
    );
  }

  #shouldBlockApplication(app: Application): boolean {
    // it seems better to block specific Applications than to do
    // a blanket block and only allow certain ones through
    // - we don't want to accidentally break Applications using a specific sheet
    const idsToBlock = [
      'navigation',
      'sidebar',
      'players',
      'hotbar',
      'pause',
      'controls'
    ];

    if (idsToBlock.includes(app.options.id)) {
      return true;
    }

    return false;
  }
}

export default BlockUnnecessaryUiShim;
