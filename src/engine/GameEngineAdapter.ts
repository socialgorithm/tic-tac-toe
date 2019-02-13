import GameEngine from "./GameEngine";

export class GameEngineAdapter {
    constructor(gameEngine: GameEngine, gameUpdateFn: () => any, gameEndFn: () => any) {
        gameEngine.sendGameUpdate = gameUpdateFn;
        gameEngine.sendGameEnd = gameEndFn;
    }
}