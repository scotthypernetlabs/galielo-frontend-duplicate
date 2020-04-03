import { ISocket } from "../interfaces/ISocket";
import io from "socket.io-client";

export class Socket implements ISocket {
  protected socket: SocketIOClient.Socket;
  constructor(namespace: string, protected token: string) {
    this.socket = io(namespace, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    });
  }
  public emit(channel: string, ...args: any[]) {
    return new Promise(resolve => {
      this.socket.emit(channel, this.token, ...args, (response: any) => {
        resolve(response);
      });
    });
  }
  public on(channel: string, callback: Function) {
    this.socket.on(channel, callback);
  }
  public close() {
    this.socket.close();
  }
}
