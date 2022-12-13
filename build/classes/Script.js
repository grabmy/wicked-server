"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Script = /** @class */ (function () {
    function Script(core, request, response) {
        this._body = '';
        this._charset = '';
        this._contentType = '';
        this._core = core;
        this._request = request;
        this._response = response;
        this._body = '';
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
    Script.prototype.run = function () { };
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
    return Script;
}());
exports.default = Script;
