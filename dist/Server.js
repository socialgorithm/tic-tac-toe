"use strict";
exports.__esModule = true;
var game_server_1 = require("@socialgorithm/game-server");
var TicTacToeGame_1 = require("./TicTacToeGame");
var Server = (function () {
    function Server(options) {
        this.gameServer = new game_server_1["default"](this.onConnection, { port: options.port });
    }
    Server.prototype.onConnection = function (bindings) {
        var game = new TicTacToeGame_1["default"](bindings);
        bindings.onStartGame(function (data) {
            game.startGame(data.players);
        });
        bindings.onPlayerMessage(function (player, payload) {
            game.onPlayerMove(player, payload.move);
        });
    };
    return Server;
}());
exports["default"] = Server;
//# sourceMappingURL=Server.js.map