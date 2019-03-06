"use strict";
exports.__esModule = true;
var SubBoard_1 = require("@socialgorithm/ultimate-ttt/dist/SubBoard");
var uuid = require("uuid/v4");
var TicTacToeGame = (function () {
    function TicTacToeGame(outputBindings) {
        this.outputBindings = outputBindings;
        this.id = uuid();
    }
    TicTacToeGame.prototype.startGame = function (players) {
        this.players = players;
        this.board = new SubBoard_1["default"](3);
        this.startTime = Math.round(Date.now() / 1000);
        this.nextPlayerIndex = 0;
        this.askForMoveFromNextPlayer();
    };
    TicTacToeGame.prototype.onPlayerMove = function (player, move) {
        var expectedPlayerIndex = this.nextPlayerIndex;
        var playedPlayerIndex = this.players.indexOf(player);
        if (expectedPlayerIndex !== playedPlayerIndex) {
            var expectedPlayer = this.players[expectedPlayerIndex];
            var message = "Expected " + expectedPlayer + " to play, but " + player + " played";
            this.handleGameWon(expectedPlayerIndex, message);
            return;
        }
        this.board = this.board.move(playedPlayerIndex, move);
        if (this.board.isFinished()) {
            this.handleGameEnd();
            return;
        }
        else {
            var previousMove = move;
            this.switchNextPlayer();
            this.askForMoveFromNextPlayer(previousMove);
            this.outputBindings.sendGameUpdate({
                stats: {
                    board: this.board
                }
            });
        }
    };
    TicTacToeGame.prototype.askForMoveFromNextPlayer = function (previousMove) {
        var nextPlayer = this.players[this.nextPlayerIndex];
        if (previousMove) {
            this.outputBindings.sendPlayerMessage(nextPlayer, { message: "opponent " + previousMove });
        }
        else {
            this.outputBindings.sendPlayerMessage(nextPlayer, { message: "move" });
        }
    };
    TicTacToeGame.prototype.switchNextPlayer = function () {
        this.nextPlayerIndex = this.nextPlayerIndex === 0 ? 1 : 0;
    };
    TicTacToeGame.prototype.handleGameEnd = function () {
        if (this.board.winner === -1) {
            this.handleGameTied();
        }
        else {
            var winnerName = this.players[this.board.winner];
            this.handleGameWon(winnerName);
        }
    };
    TicTacToeGame.prototype.handleGameTied = function () {
        this.sendGameEnd(null, true);
    };
    TicTacToeGame.prototype.handleGameWon = function (winner, message) {
        this.sendGameEnd(winner);
    };
    TicTacToeGame.prototype.sendGameEnd = function (winner, tie, message) {
        if (tie === void 0) { tie = false; }
        this.outputBindings.sendGameEnd({
            duration: this.getTimeFromStart(),
            message: message,
            stats: {
                board: this.board
            },
            tie: tie,
            winner: winner
        });
    };
    TicTacToeGame.prototype.getTimeFromStart = function () {
        var timeNow = Math.round(Date.now() / 1000);
        return timeNow - this.startTime;
    };
    return TicTacToeGame;
}());
exports["default"] = TicTacToeGame;
//# sourceMappingURL=TicTacToeGame.js.map