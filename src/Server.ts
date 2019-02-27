import GameServer from "@socialgorithm/game-server";
import { Player } from "@socialgorithm/game-server/dist/constants";
import { ServerOptions } from "./cli/options";
import TicTacToeGame from "./Engine";

export default class Server {
  private games: Map<string, TicTacToeGame>;
  private gameServer: GameServer;

  constructor(options: ServerOptions) {
    this.games = new Map<string, TicTacToeGame>();
    const gameInputBindings = {
      startGame: this.startGame,
      // tslint:disable-next-line:object-literal-sort-keys
      onPlayerMessage: this.onPlayerMessage,
    };
    this.gameServer = new GameServer(gameInputBindings, { port: options.port });
  }

  private startGame = (players: Player[]) => {
    const gameOutputBindings = {
      sendGameEnd: this.gameServer.sendGameEnd,
      sendGameUpdate: this.gameServer.sendGameUpdate,
      sendPlayerMessage: this.gameServer.sendPlayerMessage,
    };
    const newGame = new TicTacToeGame(players, gameOutputBindings);

    this.games.set(newGame.id, newGame);

    return { id: newGame.id };
  }

  private onPlayerMessage(gameId: string, player: Player, payload: any) {
    const game = this.games.get(gameId);
    if (game !== null) {
      game.onPlayerMove(player, payload.move);
    }
  }
}
