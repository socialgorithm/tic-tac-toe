import SubBoard from '@socialgorithm/ultimate-ttt/dist/SubBoard';
import Player from '@socialgorithm/ultimate-ttt';
import GameServer, { Player as ClientPlayer } from '@socialgorithm/game-server';

export default class TicTacToe {
  board: SubBoard;
  players: Array<Player>;
  nextPlayerIndex: number;
  gameServer: GameServer;

  constructor(players: Array<ClientPlayer>) {
    this.gameServer = new GameServer({ port: 3333 }, {
      startGame: this.startGame,
      onPlayerMessage: this.onPlayerMessage,
    });

    this.board = new SubBoard(3);

    // TODO Map client players to game players
    
    this.nextPlayerIndex = 0
  }

  startGame = () => {
    this.askForMoveFromNextPlayer();
  };

  onPlayerMessage = (player: ClientPlayer, payload: any) {
    this.onPlayerMove
  }

  onPlayerMove(player: Player, payload: any) {
    const expectedPlayer = this.players[this.nextPlayerIndex];
    if (expectedPlayer !== player) {
      // TODO This should either be a game message (for the tournament server), or a player message
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

  askForMoveFromNextPlayer(previousMove?: any) {
    const nextPlayer = this.players[this.nextPlayerIndex];
    if (previousMove) {
      this.gameServer.sendPlayerMessage(nextPlayer, { message: `opponent ${previousMove}` });
    } else {
      this.gameServer.sendPlayerMessage(nextPlayer, { message: "move" });
    }
  }

  switchNextPlayer() {
    this.nextPlayerIndex = this.nextPlayerIndex === 0 ? 1 : 0;
  }
}