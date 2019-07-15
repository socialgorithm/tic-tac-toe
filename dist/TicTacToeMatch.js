"use strict";
exports.__esModule = true;
var TicTacToeGame_1 = require("./TicTacToeGame");
var TicTacToeMatch = (function () {
    function TicTacToeMatch(options, players, outputChannel) {
        var _this = this;
        this.options = options;
        this.players = players;
        this.outputChannel = outputChannel;
        this.playNextGame = function () {
            var gameOutputChannel = {
                sendGameEnded: _this.onGameEnded,
                sendMatchEnded: _this.outputChannel.sendMatchEnded,
                sendMessageToPlayer: _this.outputChannel.sendMessageToPlayer
            };
            _this.currentGame = new TicTacToeGame_1["default"](_this.players, _this.onGameMessageToPlayer, _this.onGameEnded);
            _this.currentGame.start();
        };
        this.onGameMessageToPlayer = function (player, message) {
            _this.outputChannel.sendMessageToPlayer(player, message);
        };
        this.onGameEnded = function (stats) {
            _this.outputChannel.sendGameEnded(stats);
            _this.gamesCompleted++;
            if (_this.gamesCompleted < _this.options.maxGames) {
                _this.playNextGame();
            }
            else {
                _this.endMatch();
            }
        };
        this.endMatch = function () {
            _this.outputChannel.sendMatchEnded();
        };
    }
    TicTacToeMatch.prototype.start = function () {
        this.playNextGame();
    };
    TicTacToeMatch.prototype.onMessageFromPlayer = function (player, message) {
        this.currentGame.onMessageFromPlayer(player, message);
    };
    return TicTacToeMatch;
}());
exports["default"] = TicTacToeMatch;
//# sourceMappingURL=TicTacToeMatch.js.map