class CrossWindowComms extends EventTarget {
  #target: Window | null;

  constructor(target: Window | null = null) {
    super();

    this.#target = target;

    window.addEventListener('message', this.#onMessageReceived.bind(this));
  }

  send(action: string, data: PopUpConfig): void {
    const message = {
      sender: 'sheet-o-scope',
      action,
      data
    };

    if (this.#target) {
      this.#target.postMessage(message);
    }
  }

  #onMessageReceived(event: CrossWindowMessageEvent): void {
    if (this.#verifyMessage(event)) {
      // cannot re-dispatch the same event, browser complains
      const newEvent = new MessageEvent('message', { data: event.data });
      this.dispatchEvent(newEvent);
    }
  }

  #verifyMessage(event: CrossWindowMessageEvent): boolean {
    const message = event.data;

    if (
      event.origin === window.location.origin &&
      message.sender === 'sheet-o-scope'
    ) {
      return true;
    }

    return false;
  }
}

export default CrossWindowComms;
