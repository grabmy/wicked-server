"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tools_1 = __importDefault(require("./Tools"));
var Script = /** @class */ (function () {
    function Script(core, request, response, scriptFct) {
        this._body = '';
        this._charset = '';
        this._contentType = '';
        this._isAsync = false;
        this._isFinished = false;
        this._resolve = function (value) {
            return;
        };
        this._core = core;
        this._request = request;
        this._response = response;
        this._body = '';
        this._isAsync = Tools_1.default.isAsync(scriptFct);
    }
    Object.defineProperty(Script.prototype, "request", {
        get: function () {
            return this._request;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Script.prototype, "response", {
        get: function () {
            return this._response;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Script.prototype, "core", {
        get: function () {
            return this._core;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Script.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Script.prototype, "isAsync", {
        get: function () {
            return this._isAsync;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Script.prototype, "isFinished", {
        get: function () {
            return this._isFinished;
        },
        enumerable: false,
        configurable: true
    });
    Script.prototype.async = function (async) {
        this._isAsync = async;
    };
    Script.prototype.resolve = function () {
        this._resolve(true);
        if (this._isFinished == true) {
            return;
        }
        this._isFinished = true;
        if (this.isAsync) {
            this._response.send(this._body);
        }
    };
    Script.prototype.resolveAndSend = function () {
        if (this._isFinished == true) {
            return;
        }
        this._isFinished = true;
        this.send();
        this._resolve(true);
    };
    Script.prototype.send = function () {
        try {
            this._response.send(this._body);
        }
        catch (error) { }
    };
    Script.prototype.setBody = function (body) {
        this._body = body;
        return this;
    };
    Script.prototype.setHeader = function (headerName, headerValue) {
        this._response.header(headerName, headerValue);
        return this;
    };
    Script.prototype.setHeaders = function (options) {
        var _this = this;
        Object.entries(options).map(function (name) {
            if (name) {
                _this.setHeader(name + '', options[name + '']);
            }
        });
        return this;
    };
    Script.prototype.setContentType = function (contentType) {
        this._contentType = contentType;
        this.response.setHeader('Content-Type', this._contentType + (this._charset ? '; charset=' + this._charset : ''));
        return this;
    };
    Script.prototype.setCharset = function (charset) {
        this._charset = charset;
        this.response.setHeader('Content-Type', this._contentType + (this._charset ? '; charset=' + this._charset : ''));
        return this;
    };
    Script.prototype.setStatusCode = function (code) {
        this._response.statusCode = code;
        return this;
    };
    Script.prototype.promise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isAsync) {
                _this._resolve = resolve;
                if (_this._isFinished) {
                    _this.resolve();
                    _this.send();
                    resolve(true);
                }
            }
            else {
                _this.resolve();
                _this.send();
                resolve(true);
            }
        });
    };
    return Script;
}());
exports.default = Script;
//# sourceMappingURL=Script.js.map