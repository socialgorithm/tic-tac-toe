"use strict";
exports.__esModule = true;
var game_server_1 = require("@socialgorithm/game-server");
var debug = require("debug")("sg:tic-tac-toe");
var TicTacToeGame_1 = require("./TicTacToeGame");
var Server = (function () {
    function Server(options) {
        var port = process.env.PORT ? parseInt(process.env.PORT, 10) : options.port || 5433;
        this.gameServer = new game_server_1["default"](this.onConnection, { port: port });
    }
    Server.prototype.onConnection = function (bindings) {
        debug("Started new Tic Tac Toe Game");
        try {
            var game_1 = new TicTacToeGame_1["default"](bindings);
            bindings.onStartGame(function (data) {
                game_1.startGame(data.players);
            });
            bindings.onPlayerMessage(function (player, payload) {
                game_1.onPlayerMove(player, payload);
            });
        }
        catch (e) {
            debug("Tic Tac Toe Game Server error %O", e);
        }
    };
    return Server;
}());
exports["default"] = Server;
//# sourceMappingURL=Server.js.map