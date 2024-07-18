type CrossWindowMessage = {
  sender: 'sheet-o-scope';
  action: 'reattach';
  sheetId: string | null;
};

interface CrossWindowMessageEvent extends MessageEvent {
  data: CrossWindowMessage;
}

interface Shim {
  run: () => void;
}
