import { log } from './utils/logger';
import { getGame, getEntitySheet, l } from './utils/foundry';
import { addOpenableSheet } from './sheet-persistence';

import { EntityType, SocketAction, LogType } from './enums';

import SocketHandler from './socket-handler.ts';
import DetachButton from './ui/detach-button.ts';

class MainWindow extends EventTarget {
  #socketHandler?: SocketHandler;
  #waitingOnFirstPingBack?: boolean;

  constructor() {
    super();

    this.#waitingOnFirstPingBack = false;

    Hooks.once('ready', this.#initialize.bind(this));
  }

  #initialize(): void {
    const game = getGame();

    // lib-wrapper is needed to patch into Foundry code -
    // bother the GM until it's installed and enabled,
    // otherwise sheet-o-scope can't do its thing
    if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
      ui.notifications?.error(
        'Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.'
      );

      return;
    }

    log(LogType.Log, 'Setting up changes to main window');

    Hooks.on(
      'getActorSheetHeaderButtons',
      this.#modifySheetHeaderButtons.bind(this, EntityType.Actor)
    );
    Hooks.on(
      'getItemSheetHeaderButtons',
      this.#modifySheetHeaderButtons.bind(this, EntityType.Item)
    );
    Hooks.on(
      'getJournalSheetHeaderButtons',
      this.#modifySheetHeaderButtons.bind(this, EntityType.Journal)
    );

    this.#socketHandler = new SocketHandler();
    this.#socketHandler.addEventListener(
      'message',
      this.#onMessageReceived.bind(this) as EventListener
    );
  }

  #onMessageReceived(event: SocketMessageEvent): void {
    const eventData = event.data;

    if (eventData.action === SocketAction.Reattach) {
      // the secondary window has requested that a sheet gets reopened
      // in the main window
      this.#reattachSheet(eventData.data as SheetConfig);
    } else if (eventData.action === SocketAction.PingBack) {
      // the secondary window is ready to communicate
      this.#waitingOnFirstPingBack = false;
    } else if (eventData.action === SocketAction.Log) {
      // sending these to main window to make logging in the secondary window
      // less dependent on having 2 devtools open
      const logData = eventData.data as Log;
      log(logData.type, `[SECONDARY] | ${logData.message}`);
    }
  }

  #modifySheetHeaderButtons(
    type: EntityType,
    sheet: DocumentSheet,
    buttons: Application.HeaderButton[]
  ): void {
    const button = new DetachButton();
    button.onclick = () => {
      this.#detachSheet(type, sheet);
    };
    buttons.unshift(button);
  }

  async #detachSheet(type: EntityType, sheet: DocumentSheet): Promise<void> {
    const { width, height } = sheet.options;
    const id = sheet.document.id;

    if (!id) {
      return;
    }

    await addOpenableSheet({ id, type });

    sheet.close();

    const hasSecondaryWindow = await this.#isSecondaryWindowOpen();

    // if a secondary window has already been opened,
    // tell it to pull in the sheet just added
    if (hasSecondaryWindow) {
      this.#socketHandler?.send(SocketAction.Refresh);
    } else if (this.#waitingOnFirstPingBack) {
      // annoying - I can't see a reason why opening multiple sheets would be an issue
      // - the secondary window _should_ be able to just pull the latest as soon as it's ready
      //
      // it looks like an old flag is pulled in when the secondary window renders,
      // but it's too niche of an issue to try and get to the bottom of...
      ui.notifications?.error(l('SHEET-O-SCOPE.loadingDetachWarning'));

      log(
        LogType.Warn,
        'Sheet open delayed, waiting for secondary window to be ready...'
      );
    } else {
      // secondary window is unresponsive and we've not tried to open it recently
      // either this is the first open since logging in,
      // or the secondary window has been closed
      this.#waitingOnFirstPingBack = true;

      window.open(
        `/game?sheetView=1`,
        `sheet-o-scope-secondary-${id}`,
        `popup=true,width=${width},height=${height}`
      );
    }
  }

  #reattachSheet(config: SheetConfig): void {
    const { id, type } = config;
    const sheet = getEntitySheet(id, type);

    if (sheet) {
      sheet.render(true);
    }
  }

  // check if a secondary window is open by pinging it via websocket
  async #isSecondaryWindowOpen(): Promise<boolean> {
    const socketHandler = this.#socketHandler;

    if (!socketHandler) {
      throw new Error("Can't ping if socket handler isn't initialized!");
    }

    // add a temporary listener to check that a ping comes back
    // within a 1s timeout
    //
    // contained in a single promise to keep things simple elsewhere
    const promise = new Promise<boolean>((resolve) => {
      let timeout: ReturnType<typeof setTimeout>;

      const temporaryListener = ((event: SocketMessageEvent) => {
        if (event.data.action === SocketAction.PingBack) {
          socketHandler.removeEventListener('message', temporaryListener);
          clearTimeout(timeout);
          resolve(true);
        }
      }) as EventListener;

      timeout = setTimeout(() => {
        socketHandler.removeEventListener('message', temporaryListener);
        resolve(false);
      }, 1000);

      socketHandler.addEventListener('message', temporaryListener);
    });

    socketHandler.send(SocketAction.Ping);

    return promise;
  }
}

export default MainWindow;
