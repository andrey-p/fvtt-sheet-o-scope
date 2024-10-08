/// <reference types="vite/client" />

type SheetConfig = {
  id: string;
  type: EntityType;
  created?: number;
};

type SocketMessage = {
  sender: 'sheet-o-scope';
  action: SocketAction;
  data: SheetConfig;
};

interface SocketMessageEvent extends MessageEvent {
  data: SocketMessage;
}

interface Shim {
  run: () => void;
}
