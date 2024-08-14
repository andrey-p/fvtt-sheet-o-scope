import { CrossWindowAction } from './enums';
import { getGame } from './utils/foundry';

class CrossWindowComms extends EventTarget {
  constructor() {
    super();

    const game = getGame();

    if (!game.socket || !game.userId) {
      throw new Error('can\'t initialise websocket module before game is initialised');
    }

    game.socket.on('module.sheet-o-scope', this.#onMessageReceived.bind(this));
  }

  send(action: CrossWindowAction, data: PopUpConfig): void {
    const game = getGame();

    const message = {
      sender: game.userId,
      action,
      data
    };

    game.socket?.emit('module.sheet-o-scope', message);
  }

  #onMessageReceived(message: CrossWindowMessage): void {
    if (this.#verifyMessage(message)) {
      this.dispatchEvent(new MessageEvent('message', { data: message }));
    }
  }

  #verifyMessage(message: CrossWindowMessage): boolean {
    const game = getGame();

    return message.sender === game.userId;
  }
}

export default CrossWindowComms;
