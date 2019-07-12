import { Game, GameOutputChannel, Player } from "@socialgorithm/game-server";
import SubBoard from "@socialgorithm/ultimate-ttt/dist/SubBoard";

export default class TicTacToeGame implements Game {

  private board: SubBoard;
  private nextPlayerIndex: number;
  private startTime: number;

  constructor(private players: Player[], private outputChannel: GameOutputChannel) {
    this.board = new SubBoard(3);
    this.nextPlayerIndex = 0;
  }

  public start(): void {
    this.startTime = Math.round(Date.now() / 1000);
    this.outputChannel.sendPlayerMessage(this.players[0], "init");
    this.outputChannel.sendPlayerMessage(this.players[1], "init");
    this.askForMoveFromNextPlayer();
  }

  public onPlayerMessage(player: string, payload: any): void {
    this.onPlayerMove(player, payload);
  }

  private onPlayerMove(player: Player, moveStr: any) {
    const move = moveStr.split(",").map((coord: string) => parseInt(coord, 10));
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
      this.outputChannel.sendGameUpdate({
        stats: {
          board: this.board,
        },
      });
    }
  }

  private askForMoveFromNextPlayer(previousMove?: any) {
    const nextPlayer = this.players[this.nextPlayerIndex];
    if (previousMove) {
      this.outputChannel.sendPlayerMessage(nextPlayer, `opponent ${previousMove}` );
    } else {
      this.outputChannel.sendPlayerMessage(nextPlayer, "move");
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
    this.outputChannel.sendGameEnd({
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
