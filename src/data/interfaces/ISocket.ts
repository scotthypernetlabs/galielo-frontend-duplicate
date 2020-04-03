import io from "socket.io-client";

export interface ISocket {
  emit: (channel: string, ...args: any[]) => Promise<any>;
  on: (channel: string, callback: Function) => void;
  close: () => void;
}
