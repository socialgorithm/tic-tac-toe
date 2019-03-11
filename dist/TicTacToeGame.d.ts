import { Game, GameOutputChannel, Player } from "@socialgorithm/game-server";
export default class TicTacToeGame implements Game {
    private players;
    private outputChannel;
    private board;
    private nextPlayerIndex;
    private startTime;
    constructor(players: Player[], outputChannel: GameOutputChannel);
    onPlayerMessage(player: string, payload: any): void;
    private onPlayerMove;
    private askForMoveFromNextPlayer;
    private switchNextPlayer;
    private handleGameEnd;
    private handleGameTied;
    private handleGameWon;
    private sendGameEnd;
    private getTimeFromStart;
}
