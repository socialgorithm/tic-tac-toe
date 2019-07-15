import { IMatch, MatchOutputChannel, Player } from "@socialgorithm/game-server";
import { MatchOptions } from "@socialgorithm/model";
export default class TicTacToeMatch implements IMatch {
    options: MatchOptions;
    players: Player[];
    private outputChannel;
    private currentGame;
    private gamesCompleted;
    constructor(options: MatchOptions, players: Player[], outputChannel: MatchOutputChannel);
    start(): void;
    onMessageFromPlayer(player: Player, message: any): void;
    private playNextGame;
    private onGameMessageToPlayer;
    private onGameEnded;
    private endMatch;
}
