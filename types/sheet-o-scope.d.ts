/// <reference types="vite/client" />

type PopUpConfig = {
  id: string;
  type: EntityType;
  created?: number;
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
