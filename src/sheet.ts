class SheetHandler {
  constructor() {}

  init() {
    Hooks.on(
      'getActorSheetHeaderButtons',
      (_sheet: ActorSheet, buttons: Application.HeaderButton[]) => {
        const button: Application.HeaderButton = {
          label: 'SHEET-O-SCOPE.detach',
          class: 'sheet-detach',
          icon: 'fa-solid fa-arrow-up-right-from-square',
          onclick: null
        };

        buttons.unshift(button);
      }
    );
  }
}

export default SheetHandler;
