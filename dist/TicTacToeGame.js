"use strict";
exports.__esModule = true;
var SubBoard_1 = require("@socialgorithm/ultimate-ttt/dist/SubBoard");
var TicTacToeGame = (function () {
    function TicTacToeGame(players, outputChannel) {
        this.players = players;
        this.outputChannel = outputChannel;
        this.board = new SubBoard_1["default"](3);
        this.nextPlayerIndex = 0;
    }
    TicTacToeGame.prototype.start = function () {
        this.startTime = Math.round(Date.now() / 1000);
        this.outputChannel.sendPlayerMessage(this.players[0], "init");
        this.outputChannel.sendPlayerMessage(this.players[1], "init");
        this.askForMoveFromNextPlayer();
    };
    TicTacToeGame.prototype.onPlayerMessage = function (player, payload) {
        this.onPlayerMove(player, payload);
    };
    TicTacToeGame.prototype.onPlayerMove = function (player, moveStr) {
        var move = moveStr.split(",").map(function (coord) { return parseInt(coord, 10); });
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
            this.outputChannel.sendGameUpdate({
                stats: {
                    board: this.board
                }
            });
        }
    };
    TicTacToeGame.prototype.askForMoveFromNextPlayer = function (previousMove) {
        var nextPlayer = this.players[this.nextPlayerIndex];
        if (previousMove) {
            this.outputChannel.sendPlayerMessage(nextPlayer, "opponent " + previousMove);
        }
        else {
            this.outputChannel.sendPlayerMessage(nextPlayer, "move");
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
        this.outputChannel.sendGameEnd({
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