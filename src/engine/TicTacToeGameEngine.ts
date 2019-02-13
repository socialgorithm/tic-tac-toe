import GameEngine from "./GameEngine";
import SubBoard from '@socialgorithm/ultimate-ttt/dist/SubBoard';

export default class TicTacToe implements GameEngine {
  sendToPlayer: (player: Player, payload: any) => any;
  sendGameUpdate: (payload: any) => any;
  sendGameEnd: (payload: any) => any;

  board: SubBoard;
  players: Array<Player>;
  nextPlayerIndex: number;

  constructor(players: Array<Player>) {
    this.board = new SubBoard(3);
    this.players = players;
    this.nextPlayerIndex = 0
  }

  public startGame() {
    this.askForMoveFromNextPlayer();
  }

  public onPlayerMove(player: Player, payload: any) {
    const expectedPlayer = this.players[this.nextPlayerIndex];
    if (expectedPlayer !== player) {
      this.sendGameEnd(this.board);
      return;
    }

    const move = payload.move;
    this.board = this.board.move(player, move);

    if (this.board.isFinished()) {
      this.sendGameEnd(this.board)
    } else {
      const previousMove = move;
      this.switchNextPlayer();
      this.askForMoveFromNextPlayer(previousMove);
      this.sendGameUpdate(this.board)
    }
  }

  private askForMoveFromNextPlayer(previousMove?: any) {
    const nextPlayer = this.players[this.nextPlayerIndex];
    if (previousMove) {
      this.sendToPlayer(nextPlayer, { message: `opponent ${previousMove}` });
    } else {
      this.sendToPlayer(nextPlayer, { message: "move" });
    }
  }

  private switchNextPlayer() {
    this.nextPlayerIndex = this.nextPlayerIndex === 0 ? 1 : 0;
  }
}