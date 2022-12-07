"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var LogSystem_1 = __importDefault(require("./LogSystem"));
var Server = /** @class */ (function () {
    function Server(core, configuration) {
        var _a;
        this.app = null;
        this.server = null;
        this.beforeRequest = this.beforeRequest.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        this.afterRequest = this.afterRequest.bind(this);
        this.core = core;
        this.configuration = configuration;
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.static((_a = this.configuration) === null || _a === void 0 ? void 0 : _a.public));
        this.app.use(this.beforeRequest, this.handleRequest, this.afterRequest);
    }
    Server.prototype.getPort = function () {
        var _a;
        return ((_a = this.configuration) === null || _a === void 0 ? void 0 : _a.port) || 3000;
    };
    Server.prototype.start = function () {
        var _this = this;
        this.server = this.app.listen(this.getPort(), function () {
            LogSystem_1.default.log("Start listening on port " + _this.getPort(), 'success');
        });
    };
    Server.prototype.beforeRequest = function (request, response, next) {
        console.log('beforeRequest');
        next();
    };
    Server.prototype.handleRequest = function (request, response, next) {
        console.log('handleRequest');
        next();
    };
    Server.prototype.afterRequest = function (request, response, next) {
        var _a, _b;
        var accessLine = this.getClientIp(request) + ' ' + request.method + ' ' + response.statusCode + ' ' + request.url;
        //const accessLine = request.method + ' ' + response.statusCode + ' ' + request.url;
        console.log('accessLine = ' + accessLine);
        (_b = (_a = this.core) === null || _a === void 0 ? void 0 : _a.logAccess) === null || _b === void 0 ? void 0 : _b.log(accessLine);
        next();
    };
    Server.prototype.getClientIp = function (request) {
        return request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    };
    Server.prototype.stop = function () {
        // this.server
        this.server.close();
        LogSystem_1.default.log('Server stoped', 'success');
    };
    return Server;
}());
exports.default = Server;
