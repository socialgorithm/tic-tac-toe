"use strict";
exports.__esModule = true;
exports.DEFAULT_OPTIONS = void 0;
var commandLineArgs = require("command-line-args");
var getUsage = require("command-line-usage");
var info = require("../../package.json");
exports.DEFAULT_OPTIONS = {
    port: parseInt(process.env.PORT, 10) || 5433
};
var optionDefinitions = [
    {
        alias: "p",
        defaultValue: exports.DEFAULT_OPTIONS.port,
        description: "Port on which the server should be started (defaults to 5433)",
        name: "port",
        type: Number,
        typeLabel: "{underline 5433}"
    },
    {
        alias: "h",
        description: "Print this guide",
        name: "help",
        type: Boolean
    },
];
var sections = [
    {
        header: "".concat(info.name, " v").concat(info.version),
        content: info.description
    },
    {
        header: "Options",
        optionList: optionDefinitions
    },
    {
        header: "Synopsis",
        content: [
            "$ ".concat(info.name, " {bold --port} {underline 5433}"),
            "$ ".concat(info.name, " {bold --help}"),
        ]
    },
];
exports["default"] = (function () {
    var options = commandLineArgs(optionDefinitions);
    Object.keys(options).map(function (key) {
        if (options[key] === null) {
            options[key] = true;
        }
    });
    if (options.help) {
        console.log(getUsage(sections));
        process.exit(0);
    }
    if (options.port) {
        options.port = parseInt(options.port, 10);
    }
    options.port = options.port || 5433;
    return options;
});
//# sourceMappingURL=options.js.map