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
          icon: 'fa-solid fa-arrow-up-right-from-square',
          onclick: () => {
            this.handleSheetDetach(sheet);
          }
        };

        buttons.unshift(button);
      }
    );
  }

  handleSheetDetach(sheet: ActorSheet) {
    const { width, height } = sheet.options;
    const id = sheet.document.id;

    window.open(
      `/game?sheetView=${id}`,
      '_blank',
      `popup=true,width=${width},height=${height}`
    );
  }
}

export default SheetHandler;
