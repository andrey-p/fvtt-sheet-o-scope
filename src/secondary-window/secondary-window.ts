import { getEntitySheet } from '../utils/foundry';
import { getNextOpenableSheets } from '../sheet-persistence';

import { EntityType, SocketAction, LogType } from '../enums';

import SocketHandler from '../socket-handler';
import LayoutGenerator from './layout-generator';
import ReattachButton from '../ui/reattach-button';

import BlockUnnecessaryNotificationsShim from './shims/block-unnecessary-notifications';
import BlockUnnecessaryUiShim from './shims/block-unnecessary-ui';
import DisableCanvasShim from './shims/disable-canvas';

import Settings from '../settings';

const isDev = import.meta.env.MODE === 'dev';

const shims = [
  BlockUnnecessaryNotificationsShim,
  BlockUnnecessaryUiShim,
  DisableCanvasShim
];

class SecondaryWindow {
  #socketHandler?: SocketHandler;
  #layoutGenerator: LayoutGenerator;
  #settings: Settings;

  #isRenderedInPopup: boolean;
  #relayoutInProgress: boolean;
  #visibleSheets: FormApplication[];

  constructor() {
    this.#visibleSheets = [];

    this.#settings = new Settings();

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
    Hooks.once('ready', this.#ready.bind(this));

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

    const throttledWindowResize = foundry.utils
      .throttle(this.#onWindowResize, 1000)
      .bind(this);
    window.addEventListener('resize', throttledWindowResize);

    if (isDev) {
      window.addEventListener('error', (event) => {
        this.#log(LogType.Error, event.message);
      });
    }
  }

  async #initialize(): Promise<void> {
    // mild hacks that make the UX a bit nicer
    // that need to execute as early as possible
    shims.forEach((Shim) => {
      const shim = new Shim();
      shim.run();
    });

    await this.#settings.registerSettings();
  }

  async #ready(): Promise<void> {
    this.#socketHandler = new SocketHandler();
    this.#socketHandler.addEventListener(
      'message',
      this.#onMessageReceived.bind(this) as EventListener
    );

    // tell the main window that this one is ready for business...
    this.#socketHandler.send(SocketAction.PingBack);

    // ... and render any sheets that have been added to the list up to this point
    this.#refreshSheets();
  }

  #resizeSecondaryWindow(targetViewport: Rect): void {
    if (
      window.innerWidth === targetViewport.width &&
      window.innerHeight === targetViewport.height
    ) {
      return;
    }

    this.#log(LogType.Log, 'resizing secondary window');

    // window.resizeTo() only takes the outer window dimensions
    // so we need to add the current window chrome to get the size we want
    const targetWidth =
      targetViewport.width + window.outerWidth - window.innerWidth;
    const targetHeight =
      targetViewport.height + window.outerHeight - window.innerHeight;

    window.resizeTo(targetWidth, targetHeight);
  }

  // pull in any new sheets that were added since the last time
  // the secondary window refreshed
  async #refreshSheets(): Promise<void> {
    const sheetConfigs = await getNextOpenableSheets();

    this.#log(
      LogType.Log,
      `opening sheets after refresh: ${sheetConfigs.map((config) => config.id).join(', ')}`
    );

    const renderPromises = sheetConfigs.map((sheetConfig) => {
      return this.#renderSheet(sheetConfig);
    });
    await Promise.all(renderPromises);

    this.#relayoutSheets();
  }

  async #relayoutSheets(): Promise<void> {
    const layout = this.#layoutGenerator.getLayout(this.#visibleSheets);

    this.#log(LogType.Log, 'starting relayout...');
    this.#log(
      LogType.Log,
      `secondary window dimensions: ${layout.viewport.width}x${layout.viewport.height}`
    );
    this.#log(LogType.Log, `number of sheets: ${layout.sheets.length}`);

    this.#relayoutInProgress = true;

    // resize the window based on whatever the layoutGenerator
    // thinks would work the best
    this.#resizeSecondaryWindow(layout.viewport);

    // reposition each of the visible sheets based on what layoutGenerator
    // thinks would work the best
    const positionPromises = this.#visibleSheets.map((sheet, i) => {
      const { x, y, width, height } = layout.sheets[i];

      try {
        return sheet.setPosition({
          left: x,
          top: y,
          width,
          height
        });
      } catch (e: any) {
        // this will likely fire with any newly added sheet...
        // even though we've waited until the render() promise has resolved,
        // it still looks like the relevant sheet won't have been added to the DOM yet
        // which leads to an uncaught error in setPosition()
        this.#log(
          LogType.Warn,
          `Couldn't reposition sheet ${sheet.id}: ${e.message}`
        );
      }

      return Promise.resolve();
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

      // the sheet needs to know its position as it's rendered
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
      // `true` forces the sheet to display if it's not visible already
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

    // register the fact that the user has manually resized the secondary window -
    // this likely means that they want it in a specific way,
    // and further automatic resizes will likely be very annoying
    this.#layoutGenerator.resizeViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });

    this.#log(
      LogType.Log,
      'secondary window manually resized - it will no longer be automatically resized by this module'
    );

    this.#relayoutSheets();
  }

  // tweak the buttons that appear at the top of each sheet in the secondary screen
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

  // tweak the sheet itself
  #modifySheet(_sheet: DocumentSheet, elems: Element[]): void {
    if (this.#isRenderedInPopup) {
      elems[0].classList.add('secondary-window-sheet');
    }
  }

  #reattachSheet(type: EntityType, entityId: string, sheetId: string): void {
    this.#log(LogType.Log, `reattaching sheet with id: ${sheetId}`);
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
    // unless the sticky mode setting has been changed, in which case
    // the secondary window will remain empty
    const stickyModeSetting = this.#settings.get('stickyMode');

    if (!this.#visibleSheets.length && stickyModeSetting === 'normal') {
      window.close();
    } else {
      this.#relayoutSheets();
    }
  }

  // send any logs to the main window
  #log(type: LogType, message: string): void {
    // this makes debugging things less dependent
    // on having 2 instances of the devtools open
    this.#socketHandler?.send(SocketAction.Log, { type, message });
  }

  #onMessageReceived(event: SocketMessageEvent): void {
    const eventData = event.data;

    // respond to pings from the main window
    if (eventData.action === SocketAction.Ping) {
      this.#socketHandler?.send(SocketAction.PingBack);
    } else if (eventData.action === SocketAction.Refresh) {
      // refresh the visible sheets when the main window asks
      this.#refreshSheets();
    }
  }
}

export default SecondaryWindow;
