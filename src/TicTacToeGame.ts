import { GameBindings } from "@socialgorithm/game-server";
import { GameEndPayload, Player } from "@socialgorithm/game-server/dist/constants";
import SubBoard from "@socialgorithm/ultimate-ttt/dist/SubBoard";
import * as uuid from "uuid/v4";

export default class TicTacToeGame {
  public id: string;

  private board: SubBoard;
  private players: Player[];
  private nextPlayerIndex: number;
  private startTime: number;
  private endTime: number;
  private duration: number;

  constructor(private outputBindings: GameBindings) {
    this.id = uuid();
  }

  public startGame(players: Player[]) {
    this.players = players;
    this.board = new SubBoard(3);
    this.startTime = Math.round(Date.now() / 1000);
    this.nextPlayerIndex = 0;
    this.askForMoveFromNextPlayer();
  }

  public onPlayerMove(player: Player, move: any) {
    const expectedPlayerIndex: any = this.nextPlayerIndex;
    const playedPlayerIndex: any = this.players.indexOf(player);
    if (expectedPlayerIndex !== playedPlayerIndex) {
      const expectedPlayer = this.players[expectedPlayerIndex];
      const message = `Expected ${expectedPlayer} to play, but ${player} played`;
      this.handleGameWon(expectedPlayerIndex, message);
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
      this.outputBindings.sendGameUpdate({
        stats: {
          board: this.board,
        },
      });
    }
  }

  private askForMoveFromNextPlayer(previousMove?: any) {
    const nextPlayer = this.players[this.nextPlayerIndex];
    if (previousMove) {
      this.outputBindings.sendPlayerMessage(nextPlayer, { message: `opponent ${previousMove}` });
    } else {
      this.outputBindings.sendPlayerMessage(nextPlayer, { message: "move" });
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
    this.sendGameEnd(null, true);
  }

  private handleGameWon(winner: string, message?: string) {
    this.sendGameEnd(winner);
  }

  private sendGameEnd(winner?: string, tie: boolean = false, message?: string) {
    this.outputBindings.sendGameEnd({
      duration: this.getTimeFromStart(),
      message,
      stats: {
        board: this.board,
      },
      tie,
      winner,
    });
  }

  private getTimeFromStart() {
    const timeNow = Math.round(Date.now() / 1000);
    return timeNow - this.startTime;
  }
}
