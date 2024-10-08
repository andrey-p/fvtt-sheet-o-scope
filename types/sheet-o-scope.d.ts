/// <reference types="vite/client" />

type SheetConfig = {
  id: string;
  type: EntityType;
  created?: number;
};

type SocketMessagePayload = SheetConfig | null;

type SocketMessage = {
  sender: string;
  action: SocketAction;
  data: SocketMessagePayload;
};

interface SocketMessageEvent extends MessageEvent {
  data: SocketMessage;
}

interface Shim {
  run: () => void;
}
