// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:tic-tac-toe:match");

import { IMatch, MatchOutputChannel, Player } from "@socialgorithm/game-server";
import { Game, MatchOptions } from "@socialgorithm/model";
import TicTacToeGame from "./TicTacToeGame";

export default class TicTacToeMatch implements IMatch {
  private currentGame: TicTacToeGame;
  private gamesCompleted: number;

  constructor(public options: MatchOptions, public players: Player[], private outputChannel: MatchOutputChannel) {}

  public start(): void {
    debug("Starting new Tic-Tac-Toe Match");
    this.playNextGame();
  }

  public onMessageFromPlayer(player: Player, message: any) {
    this.currentGame.onMessageFromPlayer(player, message);
  }

  private playNextGame = () => {
    this.currentGame = new TicTacToeGame(this.players, this.onGameMessageToPlayer, this.onGameEnded);
    this.currentGame.start();
  }

  private onGameMessageToPlayer = (player: Player, message: any) => {
    this.outputChannel.sendMessageToPlayer(player, message);
  }

  private onGameEnded = (stats: Game) => {
    this.outputChannel.sendGameEnded(stats);

    this.gamesCompleted++;
    if (this.gamesCompleted < this.options.maxGames) {
      this.playNextGame();
    } else {
      this.endMatch();
    }
  }

  private endMatch = () => {
    this.outputChannel.sendMatchEnded();
  }
}
