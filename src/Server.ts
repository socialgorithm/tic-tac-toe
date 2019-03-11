
import GameServer, { GameOutputChannel } from "@socialgorithm/game-server";
// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:tic-tac-toe");
import { GameStartMessage } from "@socialgorithm/game-server/dist/GameMessage";
import { ServerOptions } from "./cli/options";
import TicTacToeGame from "./TicTacToeGame";

export default class Server {
  private gameServer: GameServer;

  constructor(options: ServerOptions) {
    this.gameServer = new GameServer({ name: "Tic Tac Toe" }, this.newGameFunction, { port: options.port });
  }

  private newGameFunction(gameStartMessage: GameStartMessage, outputChannel: GameOutputChannel) {
    debug("Started new Tic Tac Toe Game");
    return new TicTacToeGame(gameStartMessage.players, outputChannel);
  }
}
