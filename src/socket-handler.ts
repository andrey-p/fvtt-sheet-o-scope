import type { Socket } from 'socket.io-client';
import { SocketAction } from './enums';
import { getGame } from './utils/foundry';

class SocketHandler extends EventTarget {
  #socket: Socket;
  #senderUserId: string;

  constructor() {
    super();

    const game = getGame();

    if (!game.socket || !game.userId) {
      throw new Error(
        "can't initialise websocket module before game is initialised"
      );
    }

    this.#socket = game.socket;
    this.#senderUserId = game.userId;

    this.#socket.on('module.sheet-o-scope', this.#onMessageReceived.bind(this));
  }

  send(action: SocketAction, data?: SocketMessagePayload): void {
    const message = {
      sender: this.#senderUserId,
      action,
      data
    };

    this.#socket.emit('module.sheet-o-scope', message);
  }

  #onMessageReceived(message: SocketMessage): void {
    if (this.#verifyMessage(message)) {
      this.dispatchEvent(new MessageEvent('message', { data: message }));
    }
  }

  #verifyMessage(message: SocketMessage): boolean {
    return message.sender === this.#senderUserId;
  }
}

export default SocketHandler;
