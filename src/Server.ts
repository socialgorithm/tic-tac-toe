
import GameServer, { MatchOutputChannel, Messages } from "@socialgorithm/game-server";
// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:tic-tac-toe");
import { ServerOptions } from "./cli/options";
import TicTacToeMatch from "./TicTacToeMatch";

export default class Server {
  private gameServer: GameServer;

  constructor(options: ServerOptions) {
    const port = process.env.PORT ? parseInt( process.env.PORT, 10) : options.port || 5433;
    this.gameServer = new GameServer({ name: "Tic Tac Toe" }, this.newMatchFunction, { port });
  }

  private newMatchFunction(createMatchMessage: Messages.CreateMatchMessage, outputChannel: MatchOutputChannel) {
    return new TicTacToeMatch(createMatchMessage.options, createMatchMessage.players, outputChannel);
  }
}
