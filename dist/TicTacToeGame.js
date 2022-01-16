"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:tic-tac-toe:game");
var SubBoard_1 = require("@socialgorithm/ultimate-ttt/dist/SubBoard");
var TicTacToeGame = (function () {
    function TicTacToeGame(players, sendMessageToPlayer, sendGameEnded) {
        this.players = players;
        this.sendMessageToPlayer = sendMessageToPlayer;
        this.sendGameEnded = sendGameEnded;
        this.board = new SubBoard_1["default"](3);
        this.nextPlayerIndex = 0;
    }
    TicTacToeGame.prototype.start = function () {
        this.startTime = Math.round(Date.now() / 1000);
        this.sendMessageToPlayer(this.players[0], "init");
        this.sendMessageToPlayer(this.players[1], "init");
        this.askForMoveFromNextPlayer();
    };
    TicTacToeGame.prototype.onMessageFromPlayer = function (player, payload) {
        this.onPlayerMove(player, payload);
    };
    TicTacToeGame.prototype.onPlayerMove = function (player, moveStr) {
        var move = moveStr.split(",").map(function (coord) { return parseInt(coord, 10); });
        var expectedPlayerIndex = this.nextPlayerIndex;
        var playedPlayerIndex = this.players.indexOf(player);
        if (expectedPlayerIndex !== playedPlayerIndex) {
            var expectedPlayer = this.players[expectedPlayerIndex];
            debug("Expected ".concat(expectedPlayer, " to play, but ").concat(player, " played"));
            this.handleGameWon(expectedPlayerIndex);
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
        }
    };
    TicTacToeGame.prototype.askForMoveFromNextPlayer = function (previousMove) {
        var nextPlayer = this.players[this.nextPlayerIndex];
        if (previousMove) {
            this.sendMessageToPlayer(nextPlayer, "opponent ".concat(previousMove));
        }
        else {
            this.sendMessageToPlayer(nextPlayer, "move");
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
        this.sendGameEnded({
            duration: this.getTimeFromStart(),
            players: this.players,
            stats: {
                board: this.board
            },
            tie: true,
            winner: null
        });
    };
    TicTacToeGame.prototype.handleGameWon = function (winner) {
        this.sendGameEnded({
            duration: this.getTimeFromStart(),
            players: this.players,
            stats: {
                board: this.board
            },
            tie: false,
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