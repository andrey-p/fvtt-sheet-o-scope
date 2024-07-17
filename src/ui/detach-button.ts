class DetachButton implements Application.HeaderButton {
  label: string = 'SHEET-O-SCOPE.detach';
  class: string = 'sheet-detach';
  icon: string = 'fa-solid fa-arrow-right-from-bracket';
  onclick: ((ev: JQuery.ClickEvent) => void) | null = null;
}

export default DetachButton;
