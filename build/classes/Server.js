"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Server = /** @class */ (function () {
    function Server(core) {
        this.app = null;
        this.server = null;
        this.core = core;
        this.app = (0, express_1.default)();
    }
    Server.prototype.init = function () {
        this.app.get('/', function (req, res) {
            res.send('Hello World!');
        });
    };
    Server.prototype.start = function () {
        this.server = this.app.listen(3000, function () {
            console.log("Example app listening on port 3000");
        });
    };
    Server.prototype.stop = function () {
        this.server.close();
    };
    return Server;
}());
exports.default = Server;
