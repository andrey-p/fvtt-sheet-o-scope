/// <reference types="vite/client" />

type PopUpConfig = {
  id: string;
  type: EntityType;
  created?: number;
};

type SocketMessage = {
  sender: 'sheet-o-scope';
  action: SocketAction;
  data: PopUpConfig;
};

interface SocketMessageEvent extends MessageEvent {
  data: SocketMessage;
}

interface Shim {
  run: () => void;
}
