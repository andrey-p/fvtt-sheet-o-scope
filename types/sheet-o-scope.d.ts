/// <reference types="vite/client" />

type Rect = {
  x?: number;
  y?: number;
  width: number;
  height: number;
};

type SecondaryWindowLayout = {
  viewport: Rect;
  sheets: Rect[];
};

type Log = {
  type: LogType,
  message: string
};

type SheetConfig = {
  id: string;
  type: EntityType;
  created?: number;
};

type SocketMessagePayload = SheetConfig | Log | null;

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
