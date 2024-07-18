type PopUpConfig = {
  id: string;
  type: EntityType;
};

type CrossWindowMessage = {
  sender: 'sheet-o-scope';
  action: 'reattach';
  data: PopUpConfig;
};

interface CrossWindowMessageEvent extends MessageEvent {
  data: CrossWindowMessage;
}

interface Shim {
  run: () => void;
}
