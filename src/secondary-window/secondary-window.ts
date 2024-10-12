import { getEntitySheet } from '../utils/foundry';
import { getNextOpenableSheets } from '../sheet-persistence';

import { EntityType, SocketAction, LogType } from '../enums';

import SocketHandler from '../socket-handler';
import LayoutGenerator from './layout-generator';
import ReattachButton from '../ui/reattach-button';

import BlockUnnecessaryNotificationsShim from './shims/block-unnecessary-notifications';
import BlockUnnecessaryUiShim from './shims/block-unnecessary-ui';
import DisableCanvasShim from './shims/disable-canvas';

const isDev = import.meta.env.MODE === 'dev';

const shims = [
  BlockUnnecessaryNotificationsShim,
  BlockUnnecessaryUiShim,
  DisableCanvasShim
];

class SecondaryWindow {
  #socketHandler?: SocketHandler;
  #layoutGenerator: LayoutGenerator;

  #isRenderedInPopup: boolean;
  #relayoutInProgress: boolean;
  #visibleSheets: FormApplication[];

  constructor() {
    this.#visibleSheets = [];

    // it's possible that this was opened from Foundry running in Electron
    // in which case it's opened as a large-size browser tab with full browser chrome, not a popup window
    // and a few of the special tweaks we want to do are unnecessary
    this.#isRenderedInPopup =
      !!window.opener && window.name.includes('sheet-o-scope');

    this.#layoutGenerator = new LayoutGenerator(
      { width: window.innerWidth, height: window.innerHeight },
      window.screen.availWidth
    );

    this.#relayoutInProgress = false;

    Hooks.once('init', this.#initialize.bind(this));
    Hooks.once('ready', this.#refreshSheets.bind(this));

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

    Hooks.on('renderActorSheet', this.#modifySheet.bind(this));
    Hooks.on('renderItemSheet', this.#modifySheet.bind(this));
    Hooks.on('renderJournalSheet', this.#modifySheet.bind(this));

    // add a CSS hook to the body for all sorts of minor CSS tweaks
    document.querySelector('body')?.classList.add('sheet-o-scope-secondary');

    const throttledWindowResize = foundry.utils.throttle(this.#onWindowResize, 1000).bind(this);
    window.addEventListener('resize', throttledWindowResize);

    if (isDev) {
      window.addEventListener('error', (event) => {
        this.#log(LogType.Error, event.message);
      });
    }
  }

  #initialize(): void {
    this.#socketHandler = new SocketHandler();
    this.#socketHandler.addEventListener(
      'message',
      this.#onMessageReceived.bind(this) as EventListener
    );

    shims.forEach((Shim) => {
      const shim = new Shim();
      shim.run();
    });
  }

  #resizeSecondaryWindow(targetViewport: Rect): void {
    if (window.innerWidth === targetViewport.width && window.innerHeight === targetViewport.height) {
      return;
    }

    this.#log(LogType.Log, 'resizing secondary window');

    // window.resizeTo() only takes the outer window dimensions
    // so we need to add the current window chrome to get the size we want
    const targetWidth = targetViewport.width + window.outerWidth - window.innerWidth;
    const targetHeight = targetViewport.height + window.outerHeight - window.innerHeight;

    window.resizeTo(targetWidth, targetHeight);
  }

  // pull in any new sheets that were added since the last time
  // the secondary window refreshed
  async #refreshSheets(): Promise<void> {
    const sheetConfigs = getNextOpenableSheets();

    const renderPromises = sheetConfigs.map((sheetConfig) => {
      return this.#renderSheet(sheetConfig);
    });
    await Promise.all(renderPromises);

    this.#relayoutSheets();
  }

  async #relayoutSheets(): Promise<void> {
    const layout = this.#layoutGenerator.getLayout(this.#visibleSheets);

    this.#log(LogType.Log, 'starting relayout...');
    this.#log(LogType.Log, `secondary window dimensions: ${layout.viewport.width}x${layout.viewport.height}`);
    this.#log(LogType.Log, `number of sheets: ${layout.sheets.length}`);

    this.#relayoutInProgress = true;
    this.#resizeSecondaryWindow(layout.viewport);

    const positionPromises = this.#visibleSheets.map((sheet, i) => {
      const { x, y, width, height } = layout.sheets[i];

      return sheet.setPosition({
        left: x,
        top: y,
        width,
        height
      });
    });
    await Promise.all(positionPromises);

    this.#relayoutInProgress = false;
  }

  async #renderSheet(sheetConfig: SheetConfig): Promise<void> {
    if (!sheetConfig) {
      return;
    }

    const { id, type } = sheetConfig;
    const sheet = getEntitySheet(id, type);

    if (sheet) {
      const options: any = {};

      // the sheet needs to know its position as its rendered
      // otherwise it can only be repositioned after a delay
      // hence we need to calculate its position ASAP
      this.#visibleSheets.push(sheet);
      const layout = this.#layoutGenerator.getLayout(this.#visibleSheets);
      const thisSheetLayout = layout.sheets.pop();

      if (thisSheetLayout) {
        options.left = thisSheetLayout.x;
        options.right = thisSheetLayout.y;
        options.width = thisSheetLayout.width;
        options.height = thisSheetLayout.height;
      }

      // if this view is actually showing in a popup,
      // resizing it is done via the window
      if (this.#isRenderedInPopup) {
        options.resizable = false;
      }

      // in e.g. electron, this view will show in a new browser window
      // where being able to minimize it is still irrelevant
      options.minimizable = false;

      this.#log(LogType.Log, `Opening sheet for ${type} with ID: ${id}`);
      await sheet.render(true, options);
    } else {
      this.#log(LogType.Warn, `Couldn't find sheet for ${type} with ID: ${id}`);
    }
  }

  #onWindowResize(): void {
    // don't cause an infinite relayout loop, silly
    if (this.#relayoutInProgress) {
      return;
    }

    this.#log(LogType.Log, 'secondary window manually resized - it will no longer be automatically resized by this module');

    this.#layoutGenerator.resizeViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });

    this.#relayoutSheets();
  }

  #modifySheetHeaderButtons(
    type: EntityType,
    sheet: DocumentSheet,
    buttons: Application.HeaderButton[]
  ): void {
    const entityId = sheet.document.id;

    if (!entityId) {
      return;
    }

    // change close button so it closes the window
    // rather than just the sheet
    const closeButton = buttons.find((button) => button.class === 'close');

    if (closeButton) {
      closeButton.onclick = () => {
        this.#closeSheet(sheet.id);
      };
    }

    // add reattach button
    const reattachButton = new ReattachButton();

    reattachButton.onclick = () => {
      this.#reattachSheet(type, entityId, sheet.id);
    };
    buttons.unshift(reattachButton);
  }

  #modifySheet(_sheet: DocumentSheet, elems: Element[]): void {
    if (this.#isRenderedInPopup) {
      elems[0].classList.add('secondary-window-sheet');
    }
  }

  #reattachSheet(type: EntityType, entityId: string, sheetId: string): void {
    this.#socketHandler?.send(SocketAction.Reattach, { id: entityId, type });
    this.#closeSheet(sheetId);
  }

  #closeSheet(id: string): void {
    this.#log(LogType.Log, `closing sheet with id: ${id}`);
    const idx = this.#visibleSheets.findIndex((sheet) => sheet.id === id);

    if (idx === -1) {
      this.#log(LogType.Warn, `couldn't find sheet with id: ${id}`);
      return;
    }

    const sheet = this.#visibleSheets.splice(idx, 1)[0];
    sheet.close();

    // if this was the last visible sheet, close the secondary window
    if (!this.#visibleSheets.length) {
      window.close();
    } else {
      this.#relayoutSheets();
    }
  }

  #log(type: LogType, message: string): void {
    // sending these to main window to make logging in the secondary window
    // less dependent on having 2 devtools open
    this.#socketHandler?.send(SocketAction.Log, { type, message });
  }

  #onMessageReceived(event: SocketMessageEvent): void {
    const eventData = event.data;

    // respond to pings from the main window
    if (eventData.action === SocketAction.Ping) {
      this.#socketHandler?.send(SocketAction.PingAck);
    } else if (eventData.action === SocketAction.Refresh) {
      this.#refreshSheets();
    }
  }
}

export default SecondaryWindow;