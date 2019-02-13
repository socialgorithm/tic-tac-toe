import { SocketServer } from "./socket/socketServer";
import { IOptions } from "./cli/options";

export class Server {
    private socketServer: SocketServer;

    constructor(options: IOptions) {
        this.socketServer = new SocketServer(options.port);
    }
}