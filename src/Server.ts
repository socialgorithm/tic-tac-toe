import GameServer, { GameBindings } from "@socialgorithm/game-server";
import { Player, SOCKET_MESSAGE } from "@socialgorithm/game-server/dist/constants";
// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:tic-tac-toe");
import { ServerOptions } from "./cli/options";
import TicTacToeGame from "./TicTacToeGame";

export default class Server {
  private gameServer: GameServer;

  constructor(options: ServerOptions) {
    const port = process.env.PORT ? parseInt( process.env.PORT, 10) : options.port || 5433;
    this.gameServer = new GameServer(this.onConnection, { port });
  }

  private onConnection(bindings: GameBindings) {
    debug("Started new Tic Tac Toe Game");
    try {
      const game = new TicTacToeGame(bindings);
      bindings.onStartGame((data: any) => {
        game.startGame(data.players);
      });
      bindings.onPlayerMessage((player: Player, payload: any) => {
        game.onPlayerMove(player, payload);
      });
    } catch (e) {
      debug("Tic Tac Toe Game Server error %O", e);
    }
  }
}
