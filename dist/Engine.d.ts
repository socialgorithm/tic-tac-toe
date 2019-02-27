import { GameOutputBindings } from "@socialgorithm/game-server";
import { Player } from "@socialgorithm/game-server/dist/constants";
export default class TicTacToeGame {
    id: string;
    private outputBindings;
    private board;
    private players;
    private nextPlayerIndex;
    private startTime;
    private endTime;
    private duration;
    constructor(players: Player[], outputBindings: GameOutputBindings);
    startGame(): void;
    onPlayerMove(player: Player, move: any): void;
    private askForMoveFromNextPlayer;
    private switchNextPlayer;
    private handleGameEnd;
    private handleGameTied;
    private handleGameWon;
    private sendGameEnd;
    private getTimeFromStart;
}
