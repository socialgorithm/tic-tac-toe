"use strict";
exports.__esModule = true;
var game_server_1 = require("@socialgorithm/game-server");
var Engine_1 = require("./Engine");
var Server = (function () {
    function Server(options) {
        var _this = this;
        this.startGame = function (players) {
            var gameOutputBindings = {
                sendGameEnd: _this.gameServer.sendGameEnd,
                sendGameUpdate: _this.gameServer.sendGameUpdate,
                sendPlayerMessage: _this.gameServer.sendPlayerMessage
            };
            var newGame = new Engine_1["default"](players, gameOutputBindings);
            _this.games.set(newGame.id, newGame);
            return { id: newGame.id };
        };
        this.games = new Map();
        var gameInputBindings = {
            startGame: this.startGame,
            onPlayerMessage: this.onPlayerMessage
        };
        this.gameServer = new game_server_1["default"](gameInputBindings, { port: options.port });
    }
    Server.prototype.onPlayerMessage = function (gameId, player, payload) {
        var game = this.games.get(gameId);
        if (game !== null) {
            game.onPlayerMove(player, payload.move);
        }
    };
    return Server;
}());
exports["default"] = Server;
//# sourceMappingURL=Server.js.map