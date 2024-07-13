class SheetHandler {
  constructor() {}

  init() {
    Hooks.on(
      'getActorSheetHeaderButtons',
      (sheet: ActorSheet, buttons: Application.HeaderButton[]) => {
        const button: Application.HeaderButton = {
          label: 'SHEET-O-SCOPE.detach',
          class: 'sheet-detach',
          icon: 'fa-arrow-up-right-from-square',
          onclick: () => {
            this.handleSheetDetach(sheet);
          }
        };

        buttons.unshift(button);
      }
    );
  }

  handleSheetDetach(sheet: ActorSheet) {
    const { id, width, height } = sheet.options;

    window.open(`/game?sheetView=${id}&width=${width}&height=${height}`,
      '_blank',
      `popup=true,width=${width},height=${height}`
    );
  }
}

export default SheetHandler;
