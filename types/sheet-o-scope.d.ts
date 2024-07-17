enum WindowMode {
  Main = "MAIN",
  PopUp = "POPUP"
};

type CrossWindowMessage = {
  sender: 'sheet-o-scope',
  action: 'reattach',
  sheetId: string | null
};

interface CrossWindowMessageEvent extends MessageEvent {
  data: CrossWindowMessage
}
