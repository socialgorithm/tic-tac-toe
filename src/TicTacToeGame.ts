import { IMatch, MatchOutputChannel, Messages, Player } from "@socialgorithm/game-server";
import SubBoard from "@socialgorithm/ultimate-ttt/dist/SubBoard";
import { debug } from "util";

export default class TicTacToeGame {
  private gameID: string;
  private board: SubBoard;
  private nextPlayerIndex: number;
  private startTime: number;

  constructor(private players: Player[], private sendMessageToPlayer: (player: Player, message: any) => void, private sendGameEnded: (stats: Messages.GameEndedMessage) => void) {
    this.board = new SubBoard(3);
    this.nextPlayerIndex = 0;
  }

  public start(): void {
    this.startTime = Math.round(Date.now() / 1000);
    this.sendMessageToPlayer(this.players[0], "init");
    this.sendMessageToPlayer(this.players[1], "init");
    this.askForMoveFromNextPlayer();
  }

  public onMessageFromPlayer(player: string, payload: any): void {
    this.onPlayerMove(player, payload);
  }

  private onPlayerMove(player: Player, moveStr: any) {
    const move = moveStr.split(",").map((coord: string) => parseInt(coord, 10));
    const expectedPlayerIndex: any = this.nextPlayerIndex;
    const playedPlayerIndex: any = this.players.indexOf(player);
    if (expectedPlayerIndex !== playedPlayerIndex) {
      const expectedPlayer = this.players[expectedPlayerIndex];
      debug(`Expected ${expectedPlayer} to play, but ${player} played`);
      this.handleGameWon(expectedPlayerIndex);
      return;
    }

    this.board = this.board.move(playedPlayerIndex, move);

    if (this.board.isFinished()) {
      this.handleGameEnd();
      return;
    } else {
      const previousMove = move;
      this.switchNextPlayer();
      this.askForMoveFromNextPlayer(previousMove);
    }
  }

  private askForMoveFromNextPlayer(previousMove?: any) {
    const nextPlayer = this.players[this.nextPlayerIndex];
    if (previousMove) {
      this.sendMessageToPlayer(nextPlayer, `opponent ${previousMove}` );
    } else {
      this.sendMessageToPlayer(nextPlayer, "move");
    }
  }

  private switchNextPlayer() {
    this.nextPlayerIndex = this.nextPlayerIndex === 0 ? 1 : 0;
  }

  private handleGameEnd() {
    if (this.board.winner === -1) {
      this.handleGameTied();
    } else {
      const winnerName = this.players[this.board.winner];
      this.handleGameWon(winnerName);
    }
  }

  private handleGameTied() {
    this.sendGameEnded({
      duration: this.getTimeFromStart(),
      players: this.players,
      stats: {
        board: this.board,
      },
      tie: true,
      winner: null,
    });
  }

  private handleGameWon(winner: string) {
    this.sendGameEnded({
      duration: this.getTimeFromStart(),
      players: this.players,
      stats: {
        board: this.board,
      },
      tie: false,
      winner,
    });
  }

  private getTimeFromStart() {
    const timeNow = Math.round(Date.now() / 1000);
    return timeNow - this.startTime;
  }
}
