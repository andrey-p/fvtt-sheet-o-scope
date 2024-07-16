type CrossWindowMessage = {
  sender: 'sheet-o-scope',
  action: 'reattach',
  sheetId: string | null
};
