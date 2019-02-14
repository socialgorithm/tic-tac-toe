import SubBoard from '@socialgorithm/ultimate-ttt/dist/SubBoard';
import Player from '@socialgorithm/ultimate-ttt';
import GameServer, { Player as ClientPlayer } from '@socialgorithm/game-server';
import { GameEndPayload } from '@socialgorithm/game-server/dist/constants';

export default class TicTacToe {
  board: SubBoard;
  players: Array<ClientPlayer>;
  nextPlayerIndex: number;
  gameServer: GameServer;

  constructor(players: Array<ClientPlayer>) {
    this.gameServer = new GameServer({ port: 3333 }, {
      startGame: this.startGame,
      onPlayerMessage: this.onPlayerMessage,
    });

    this.board = new SubBoard(3);
    
    this.players = players;

    this.nextPlayerIndex = 0
  }

  startGame = () => {
    this.askForMoveFromNextPlayer();
  };

  onPlayerMessage(player: ClientPlayer, payload: any) {
    const expectedPlayer = this.nextPlayerIndex;
    const playerIndex: any = this.players.indexOf(player);
    if (expectedPlayer !== playerIndex) {
      // TODO This should either be a game message (for the tournament server), or a player message
      this.gameServer.sendGameMessage('UPDATE', this.board);
      return;
    }

    const move = payload.move;
    this.board = this.board.move(playerIndex, move);

    if (this.board.isFinished()) {
      const payload: GameEndPayload = {
        winner: null,
        tie: null,
        duration: null,
        message: null,
        stats: {
          board: this.board,
        },
      };
      this.gameServer.sendGameMessage('END', payload)
    } else {
      const previousMove = move;
      this.switchNextPlayer();
      this.askForMoveFromNextPlayer(previousMove);
      this.gameServer.sendGameMessage('UPDATE', {
        stats: {
          board: this.board,
        },
      });
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