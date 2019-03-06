import GameServer, { GameBindings } from "@socialgorithm/game-server";
import { Player, SOCKET_MESSAGE } from "@socialgorithm/game-server/dist/constants";
import { ServerOptions } from "./cli/options";
import TicTacToeGame from "./TicTacToeGame";

export default class Server {
  private gameServer: GameServer;

  constructor(options: ServerOptions) {
    this.gameServer = new GameServer(this.onConnection, { port: options.port });
  }

  private onConnection(bindings: GameBindings) {
    const game = new TicTacToeGame(bindings);
    bindings.onStartGame((data: any) => {
      game.startGame(data.players);
    });
    bindings.onPlayerMessage((player: Player, payload: any) => {
      game.onPlayerMove(player, payload.move);
    });
  }
}
