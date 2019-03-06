import { GameBindings } from "@socialgorithm/game-server";
import { Player } from "@socialgorithm/game-server/dist/constants";
export default class TicTacToeGame {
    private outputBindings;
    id: string;
    private board;
    private players;
    private nextPlayerIndex;
    private startTime;
    private endTime;
    private duration;
    constructor(outputBindings: GameBindings);
    startGame(players: Player[]): void;
    onPlayerMove(player: Player, move: any): void;
    private askForMoveFromNextPlayer;
    private switchNextPlayer;
    private handleGameEnd;
    private handleGameTied;
    private handleGameWon;
    private sendGameEnd;
    private getTimeFromStart;
}
