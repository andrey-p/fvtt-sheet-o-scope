import { log } from './utils/logger';
import { getGame, getEntitySheet, l } from './utils/foundry';
import { addOpenableSheet } from './sheet-persistence';

import { EntityType, SocketAction, LogType, ControlledMode } from './enums';

import SocketHandler from './socket-handler';
import DetachButton from './ui/detach-button';

import Settings from './settings';

class MainWindow extends EventTarget {
  #socketHandler?: SocketHandler;
  #waitingOnFirstPingBack?: boolean;
  #settings: Settings;

  constructor() {
    super();

    this.#waitingOnFirstPingBack = false;

    Hooks.once('ready', this.#ready.bind(this));

    this.#settings = new Settings();
  }

  async #ready(): Promise<void> {
    const game = getGame();

    // lib-wrapper is needed to patch into Foundry code -
    // bother the GM until it's installed and enabled,
    // otherwise sheet-o-scope can't do its thing
    if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
      ui.notifications?.error(l('SHEET-O-SCOPE.noLibWrapperWarning'));

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

    await this.#settings.registerSettings();
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
    const id = sheet.document.id;

    if (!id) {
      return;
    }

    // persist the sheet, and close it in this window
    await addOpenableSheet({ id, type });

    sheet.close();

    const hasSecondaryWindow = await this.#isSecondaryWindowOpen();

    // if the secondary window has already been opened,
    // tell it to pull in the sheet just added
    if (hasSecondaryWindow) {
      this.#socketHandler?.send(SocketAction.Refresh);
    } else if (this.#waitingOnFirstPingBack) {
      // annoying...
      //
      // I can't see a reason why opening multiple sheets while the secondary window is loading
      // would be an issue - it _should_ be able to just pull the latest as soon as it's ready
      //
      // it looks like the secondary window pulls in just the first sheet when it calls getOpenableSheets()
      // so it's possible that it's lost when persisted via Foundry's setFlag()
      //
      // this is way too niche of an issue to spend a lot of time on debugging,
      // so at the very least give the user a heads up
      ui.notifications?.error(l('SHEET-O-SCOPE.loadingDetachWarning'));
    } else {
      // secondary window is unresponsive and we don't think it's currently loading
      //
      // either this is the first time we've opened it this session,
      // or the secondary window has been closed at some point
      //
      // either way, go ahead and open it
      this.#waitingOnFirstPingBack = true;

      let { width, height } = sheet.options;

      // if width / height are undefined, give them some nominal dimensions
      if (!width) {
        width = 600;
      }
      // note: height can also have a string value ('auto')
      if (typeof height === 'string' || !height) {
        height = 700;
      }

      // uncontrolled mode makes the secondary window more like a
      // freeform container for users to position their sheets as they wish
      // so give them some extra initial space, to drive the point across
      if (
        this.#settings.get('controlledMode') === ControlledMode.Uncontrolled
      ) {
        width += 100;
        height += 100;
      }

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
