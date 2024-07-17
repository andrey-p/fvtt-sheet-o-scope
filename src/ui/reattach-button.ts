class ReattachButton implements Application.HeaderButton {
  label: string = 'SHEET-O-SCOPE.reattach';
  class: string = 'sheet-reattach';
  icon: string = 'fa-solid fa-arrow-right-from-bracket';
  onclick: ((ev: JQuery.ClickEvent) => void) | null = null;
}

export default ReattachButton;
