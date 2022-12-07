"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration = /** @class */ (function () {
    function Configuration(data) {
        this._data = initConfigurationData(data);
    }
    Object.defineProperty(Configuration.prototype, "name", {
        get: function () {
            return this._data.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "port", {
        get: function () {
            return this._data.port;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "public", {
        get: function () {
            return this._data.public;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "log", {
        get: function () {
            return this._data.log;
        },
        enumerable: false,
        configurable: true
    });
    return Configuration;
}());
exports.default = Configuration;
function initConfigurationData(options) {
    var defaults = {
        name: '',
        port: 3000,
        public: 'public/',
        log: initLog(),
    };
    return __assign(__assign({}, defaults), options);
}
function initLog(options) {
    var defaults = {
        error: { enabled: false },
        access: { enabled: false },
    };
    return __assign(__assign({}, defaults), options);
}
