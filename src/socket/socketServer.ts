import * as fs from "fs";
import * as http from "http";
import * as io from "socket.io";

export class SocketServer {
    private io: SocketIO.Server;

    constructor(private port: number) {
        const app = http.createServer(this.onHttpMessage);
        this.io = io(app);
        app.listen(this.port);

        console.log('Socket Listening on port ' + this.port);

        this.io.on('connection', function (socket) {
            this.createGame()

            socket.on('START', this.onGameStart)
            socket.on('PLAYER', this.onPlayerMessage)
        })
    }

    /**
     * Handler for the WebSocket server. It returns a static HTML file for any request
     * that links to the server documentation and Github page.
     * @param req
     * @param res
     */
    private onHttpMessage(req: http.IncomingMessage, res: http.ServerResponse) {
        fs.readFile(__dirname + "/../../public/index.html",
            (err: any, data: any) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading index.html");
                }

                res.writeHead(200);
                res.end(data);
            });
    }

    private onGameCreate() {
        //Create the game engine
        //Game engine must have callbacks to UPDATE and END
    }

    private onGameStart(data: any) {

        console.log(data)
    }

    private onPlayerMessage(data: any) {
        this.onPlayerToGame(data.player, data.payload)
    }

    private onPlayerToGame(player: Player, data: any) {
        console.log(data)
    }
}