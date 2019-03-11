"use strict";
exports.__esModule = true;
var game_server_1 = require("@socialgorithm/game-server");
var debug = require("debug")("sg:tic-tac-toe");
var TicTacToeGame_1 = require("./TicTacToeGame");
var Server = (function () {
    function Server(options) {
        this.gameServer = new game_server_1["default"]({ name: "Tic Tac Toe" }, this.newGameFunction, { port: options.port });
    }
    Server.prototype.newGameFunction = function (gameStartMessage, outputChannel) {
        debug("Started new Tic Tac Toe Game");
        return new TicTacToeGame_1["default"](gameStartMessage.players, outputChannel);
    };
    return Server;
}());
exports["default"] = Server;
//# sourceMappingURL=Server.js.map