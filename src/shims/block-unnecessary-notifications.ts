// blocks certain default, irrelevant Foundry notifications from rendering
class BlockUnnecessaryNotificationsShim implements Shim {
  run(): void {
    // the shim's `this` will be inaccessible in libWrapper's callback
    // so, pop this method into local scope for the next bit
    const shouldBlockNotification = this.#shouldBlockNotification;

    libWrapper.register(
      'sheet-o-scope',
      'Notifications.prototype.notify',
      function (
        this: Notification,
        fn: Function,
        ...args: [string, string]
      ): number {
        if (shouldBlockNotification(args)) {
          return -1;
        }

        return fn(...args);
      }
    );
  }

  #shouldBlockNotification(args: [string, string]): boolean {
    const [message, type] = args;

    // this is brittle but there doesn't seem to be a better way of targeting them
    // luckily, these seem to not be translated

    // info notification that canvas is disabled
    if (
      type === 'info' &&
      message.includes('not displayed because the game Canvas is disabled')
    ) {
      return true;
    }

    // warning that the window is too small
    if (
      type === 'error' &&
      message.includes(
        'Foundry Virtual Tabletop requires a minimum screen resolution'
      )
    ) {
      return true;
    }

    return false;
  }
}

export default BlockUnnecessaryNotificationsShim;
