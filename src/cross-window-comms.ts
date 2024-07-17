class CrossWindowComms extends EventTarget {
  #target: Window | null;

  constructor(target: Window | null = null) {
    super();

    this.#target = target;

    window.addEventListener('message', this.#onMessageReceived);
  }

  send(action: string, args: object): void {
    const message = {
      sender: 'sheet-o-scope',
      action,
      ...args
    } as CrossWindowMessage;

    if (this.#target) {
      this.#target.postMessage(message);
    }
  }

  #onMessageReceived(event: CrossWindowMessageEvent): void {
    if (this.#verifyMessage(event)) {
      this.dispatchEvent(event);
    }
  }

  #verifyMessage(event: CrossWindowMessageEvent): boolean {
    const message = event.data;

    if (event.origin === window.location.origin && message.sender === 'sheet-o-scope') {
      return true;
    }

    return false;
  }
}

export default CrossWindowComms;
