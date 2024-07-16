import { getGame } from './utils/ts-utils';

class SheetHandler {
  constructor() {}

  init() {
    // add detach button to actor sheet
    Hooks.on(
      'getActorSheetHeaderButtons',
      (sheet: ActorSheet, buttons: Application.HeaderButton[]) => {
        const button: Application.HeaderButton = {
          label: 'SHEET-O-SCOPE.detach',
          class: 'sheet-detach',
          icon: 'fa-solid fa-arrow-right-from-bracket',
          onclick: () => {
            this.handleSheetDetach(sheet);
          }
        };

        buttons.unshift(button);
      }
    );

    window.addEventListener('message', (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const message = event.data as CrossWindowMessage;
      const game = getGame();

      if (message.sender === 'sheet-o-scope' && message.action === 'reattach' && message.sheetId) {
        game.actors?.get(message.sheetId)?.sheet?.render(true);
      }
    });
  }

  handleSheetDetach(sheet: ActorSheet) {
    const { width, height } = sheet.options;
    const id = sheet.document.id;

    sheet.close();

    window.open(
      `/game?sheetView=${id}`,
      '_blank',
      `popup=true,width=${width},height=${height}`
    );
  }
}

export default SheetHandler;
