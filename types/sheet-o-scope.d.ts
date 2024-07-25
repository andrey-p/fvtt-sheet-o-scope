/// <reference types="vite/client" />

type PopUpConfig = {
  id: string;
  type: EntityType;
};

type CrossWindowMessage = {
  sender: 'sheet-o-scope';
  action: CrossWindowAction;
  data: PopUpConfig;
};

interface CrossWindowMessageEvent extends MessageEvent {
  data: CrossWindowMessage;
}

interface Shim {
  run: () => void;
}
