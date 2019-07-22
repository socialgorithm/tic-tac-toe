"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:tic-tac-toe:match");
var TicTacToeGame_1 = require("./TicTacToeGame");
var TicTacToeMatch = (function () {
    function TicTacToeMatch(options, players, outputChannel) {
        var _a;
        var _this = this;
        this.options = options;
        this.players = players;
        this.outputChannel = outputChannel;
        this.gamesCompleted = 0;
        this.missingPlayers = [];
        this.playNextGame = function () {
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
        this.sendMatchEndDueToTimeout = function (missingPlayer) {
            var winnerIndex = -1;
            var timeoutMessage = "Players did not connect in time";
            if (missingPlayer) {
                var winner_1 = _this.players.find(function (player) { return player !== missingPlayer; });
                winnerIndex = _this.players.findIndex(function (player) { return player === winner_1; });
                timeoutMessage = missingPlayer + " did not connect in time, or disconnected";
            }
            var matchEndedMessage = {
                games: [],
                matchID: "--",
                messages: [timeoutMessage],
                options: _this.options,
                players: _this.players,
                state: "finished",
                stats: {
                    gamesCompleted: 0,
                    gamesTied: 0,
                    wins: [0, 0]
                },
                winner: winnerIndex
            };
            debug("Sending match ended due to timeout %O", matchEndedMessage);
            _this.outputChannel.sendMatchEnded(matchEndedMessage);
        };
        (_a = this.missingPlayers).push.apply(_a, players);
        setTimeout(function () {
            if (_this.missingPlayers.length === 1) {
                debug(_this.missingPlayers[0] + " did not connect to match, sending match end");
                _this.sendMatchEndDueToTimeout(_this.missingPlayers[0]);
            }
            else if (_this.missingPlayers.length > 1) {
                debug("Players did not connect to match, sending match end");
                _this.sendMatchEndDueToTimeout();
            }
        }, 5000);
    }
    TicTacToeMatch.prototype.onPlayerConnected = function (player) {
        debug("Player " + player + " connected to match");
        this.missingPlayers = this.missingPlayers.filter(function (missingPlayer) { return player !== missingPlayer; });
    };
    TicTacToeMatch.prototype.onPlayerDisconnected = function (player) {
        debug("Player " + player + " disconnected from match");
        if (!this.missingPlayers.find(function (missingPlayer) { return missingPlayer === player; })) {
            this.missingPlayers.push(player);
        }
        this.sendMatchEndDueToTimeout(player);
    };
    TicTacToeMatch.prototype.start = function () {
        debug("Starting new Tic-Tac-Toe Match");
        this.playNextGame();
    };
    TicTacToeMatch.prototype.onMessageFromPlayer = function (player, message) {
        this.currentGame.onMessageFromPlayer(player, message);
    };
    return TicTacToeMatch;
}());
exports["default"] = TicTacToeMatch;
//# sourceMappingURL=TicTacToeMatch.js.map