"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var LogSystem_1 = __importDefault(require("./LogSystem"));
var Tools_1 = __importDefault(require("./Tools"));
var Script_1 = __importDefault(require("./Script"));
var decache = require('decache');
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
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var isNodeScript, nodeScriptFile, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isNodeScript = false;
                        nodeScriptFile = this.configuration.public + request.url;
                        if (Tools_1.default.getUrlExtension(request.url) == 'node.js') {
                            isNodeScript = true;
                        }
                        response.on('finish', function () {
                            _this.afterRequest(request, response, next);
                        });
                        if (!(isNodeScript && Tools_1.default.fileExists(nodeScriptFile))) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.execute(nodeScriptFile, request, response)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        (_a = this.core.logError) === null || _a === void 0 ? void 0 : _a.log(error_1 + '', 'error');
                        response.statusCode = 500;
                        return [3 /*break*/, 4];
                    case 4:
                        try {
                            response.send('');
                        }
                        catch (err) { }
                        _b.label = 5;
                    case 5:
                        next();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Server.prototype.execute = function (nodeScriptFile, request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var pathAbsolute, scriptFct, scriptInstance, result, promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Tools_1.default.fileExists(nodeScriptFile)) return [3 /*break*/, 3];
                        pathAbsolute = require('path').resolve('./' + nodeScriptFile);
                        //const requirePathAbsolute = require.resolve(pathAbsolute);
                        //const requirePathAbsolute2 = require.resolve('./' + nodeScriptFile);
                        console.log(pathAbsolute + ' pathAbsolute = ' + typeof require.cache[pathAbsolute]);
                        //console.log(requirePathAbsolute + ' requirePathAbsolute = ' + typeof require.cache[requirePathAbsolute]);
                        //console.log(requirePathAbsolute2 + ' requirePathAbsolute2 = ' + typeof require.cache[requirePathAbsolute2]);
                        //delete require.cache[pathAbsolute];
                        //delete require.cache[requirePathAbsolute];
                        //delete require.cache[requirePathAbsolute2];
                        //require.cache[pathAbsolute] = undefined;
                        //require.cache[requirePathAbsolute] = undefined;
                        //require.cache[requirePathAbsolute2] = undefined;
                        decache(pathAbsolute);
                        //decache(requirePathAbsolute);
                        //decache(requirePathAbsolute2);
                        console.log(pathAbsolute + ' pathAbsolute = ' + typeof require.cache[pathAbsolute]);
                        scriptFct = require(pathAbsolute);
                        console.log(pathAbsolute + ' pathAbsolute = ' + typeof require.cache[pathAbsolute]);
                        //console.log(requirePathAbsolute + ' requirePathAbsolute = ' + typeof require.cache[requirePathAbsolute]);
                        //console.log(requirePathAbsolute2 + ' requirePathAbsolute2 = ' + typeof require.cache[requirePathAbsolute2]);
                        console.log('--');
                        scriptInstance = new Script_1.default(this, request, response, scriptFct);
                        return [4 /*yield*/, scriptFct(scriptInstance)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, scriptInstance.promise()];
                    case 2:
                        promise = _a.sent();
                        return [2 /*return*/, promise];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // this.server
                    return [4 /*yield*/, this.server.close()];
                    case 1:
                        // this.server
                        _a.sent();
                        LogSystem_1.default.log('Server stopped', 'success');
                        return [2 /*return*/];
                }
            });
        });
    };
    return Server;
}());
exports.default = Server;
//# sourceMappingURL=Server.js.map