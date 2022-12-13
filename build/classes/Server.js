"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var LogSystem_1 = __importDefault(require("./LogSystem"));
var Tools_1 = __importDefault(require("./Tools"));
var Script_1 = __importDefault(require("./Script"));
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
        this.app.use(this.beforeRequest);
        this.app.use(express_1.default.static((_a = this.configuration) === null || _a === void 0 ? void 0 : _a.public));
    }
    Server.prototype.getPort = function () {
        var _a;
        return ((_a = this.configuration) === null || _a === void 0 ? void 0 : _a.port) || 3000;
    };
    Server.prototype.start = function () {
        var _this = this;
        try {
            this.server = this.app.listen(this.getPort(), function () {
                LogSystem_1.default.log("Start listening on port " + _this.getPort(), 'success');
            });
            this.server.on('error', function (error) {
                var _a;
                if (error.code === 'EADDRINUSE') {
                    LogSystem_1.default.log(error + '', 'critical');
                    _this.core.stop();
                }
                else {
                    (_a = _this.core.logError) === null || _a === void 0 ? void 0 : _a.log(error + '', 'error');
                }
            });
        }
        catch (error) {
            LogSystem_1.default.log(error + '', 'critical');
        }
    };
    Server.prototype.beforeRequest = function (request, response, next) {
        var _this = this;
        var _a;
        var isNodeScript = false;
        if (Tools_1.default.getUrlExtension(request.url) == 'node.js') {
            isNodeScript = true;
        }
        response.on('finish', function () {
            _this.afterRequest(request, response, next);
        });
        if (isNodeScript) {
            var success = false;
            try {
                var nodeScriptFile = this.configuration.public + request.url;
                success = this.execute(nodeScriptFile, request, response);
            }
            catch (error) {
                (_a = this.core.logError) === null || _a === void 0 ? void 0 : _a.log(error + '', 'error');
            }
            if (!success) {
                next();
            }
        }
        else {
            next();
        }
    };
    Server.prototype.execute = function (nodeScriptFile, request, response) {
        var _a;
        if (Tools_1.default.fileExists(nodeScriptFile)) {
            try {
                var pathAbsolute = require('path').resolve(nodeScriptFile);
                var scriptFct = require(pathAbsolute);
                var scriptInstance = new Script_1.default(this, request, response);
                var result = scriptFct(scriptInstance);
                response.send(scriptInstance.body);
                return true;
                // delete cache so the file is also executed next time
                //require?.cache[pathAbsolute] = null;
            }
            catch (error) {
                (_a = this.core.logError) === null || _a === void 0 ? void 0 : _a.log(error + '', 'error');
                return false;
            }
        }
        return false;
    };
    Server.prototype.handleRequest = function (request, response, next) {
        next();
    };
    Server.prototype.afterRequest = function (request, response, next) {
        var _a;
        var accessLine = this.getClientIp(request) + ' ' + request.method + ' ' + response.statusCode + ' ' + request.url;
        (_a = this.core.logAccess) === null || _a === void 0 ? void 0 : _a.log(accessLine);
        next();
    };
    Server.prototype.getClientIp = function (request) {
        return request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    };
    Server.prototype.stop = function () {
        // this.server
        this.server.close();
        LogSystem_1.default.log('Server stopped', 'success');
    };
    return Server;
}());
exports.default = Server;
