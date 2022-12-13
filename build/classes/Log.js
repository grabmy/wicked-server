"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tools_1 = __importDefault(require("./Tools"));
var LogSystem_1 = __importDefault(require("./LogSystem"));
var LogTarget;
(function (LogTarget) {
    LogTarget[LogTarget["Console"] = 0] = "Console";
    LogTarget[LogTarget["File"] = 1] = "File";
})(LogTarget || (LogTarget = {}));
var Log = /** @class */ (function () {
    function Log(name, options) {
        this.output = [];
        this.noColors = false;
        this.noDateTime = false;
        this.hasCriticalError = false;
        this.isSilent = false;
        this.name = '';
        this._target = [];
        this._file = '';
        this._enabled = true;
        this._hasError = false;
        this.name = name;
        if (!options.enabled) {
            this.enabled = false;
        }
        for (var name_1 in options) {
            switch (name_1) {
                case 'target':
                    this.target = options.target;
                    break;
                case 'file':
                    this.file = options.file;
                    break;
            }
        }
        if (options.enabled) {
            this.enabled = true;
        }
        if (!this.valid()) {
            this._enabled = false;
        }
    }
    Object.defineProperty(Log.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (enabled) {
            if (enabled) {
                if (!this.target || this.target.length == 0) {
                    return;
                }
                if (!this.file || !Tools_1.default.dirExists(Tools_1.default.getDir(this.file))) {
                    return;
                }
            }
            this._enabled = !!enabled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Log.prototype, "hasError", {
        get: function () {
            return this._hasError;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Log.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (newTarget) {
            if (typeof newTarget == 'string') {
                this._target = [];
                this.addTarget(newTarget);
            }
            else if (Array.isArray(newTarget)) {
                this._target = [];
                for (var index = 0; index < newTarget.length; index++) {
                    this.addTarget(newTarget[index]);
                }
            }
            else {
                if (this._enabled) {
                    if (this.name != '') {
                        LogSystem_1.default.log('Invalid configuration for ' + this.name + ' log', 'warning');
                    }
                    LogSystem_1.default.log('Wrong type for log target "' + typeof newTarget + '"', 'warning');
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Log.prototype, "file", {
        get: function () {
            return this._file;
        },
        set: function (file) {
            // const pathAbsolute = require('fs').resolve(file);
            if (this._enabled) {
                if (!Tools_1.default.dirExists(Tools_1.default.getDir(file))) {
                    if (this.name != '') {
                        LogSystem_1.default.log('Invalid configuration for ' + this.name + ' log', 'warning');
                    }
                    LogSystem_1.default.log('Directory do not exist "' + Tools_1.default.getDir(file) + '"', 'warning');
                }
            }
            this._file = file;
        },
        enumerable: false,
        configurable: true
    });
    Log.prototype.valid = function () {
        if (!Tools_1.default.dirExists(Tools_1.default.getDir(this.file))) {
            return false;
        }
        if (!this.target || this.target.length == 0) {
            return false;
        }
        return true;
    };
    Log.prototype.addTarget = function (newTarget) {
        switch (newTarget) {
            case 'file':
                this._target.push(LogTarget.File);
                break;
            case 'console':
                this._target.push(LogTarget.Console);
                break;
            default:
                if (this._enabled) {
                    if (this.name != '') {
                        LogSystem_1.default.log('Invalid configuration for ' + this.name + ' log', 'warning');
                    }
                    LogSystem_1.default.log('Unable to create log target "' + newTarget + '"', 'warning');
                }
                break;
        }
    };
    Log.prototype.reset = function () {
        this.output = [];
        this.noColors = false;
        this.noDateTime = false;
        this.hasCriticalError = false;
        this.isSilent = false;
        this._hasError = false;
        this._enabled = true;
        this._file = '';
        this._target = [];
    };
    Log.prototype.getColor = function (type) {
        if (type === void 0) { type = ''; }
        if (this.noColors) {
            return '';
        }
        switch (type) {
            case 'critical':
            case 'error':
                return '\x1b[31m%s\x1b[0m';
            case 'warning':
                return '\x1b[33m%s\x1b[0m';
            case 'info':
                return '\x1b[36m%s\x1b[0m';
            case 'sexy':
                return '\x1b[35m%s\x1b[0m';
            case 'success':
                return '\x1b[32m%s\x1b[0m';
            default:
                return '\x1b[37m%s\x1b[0m';
        }
    };
    Log.prototype.getDateTime = function () {
        if (this.noDateTime) {
            return '';
        }
        return '[' + Tools_1.default.getDateTime() + ']';
    };
    Log.prototype.log = function (message, type) {
        var _this = this;
        if (type === void 0) { type = 'regular'; }
        if (!this._enabled) {
            return;
        }
        var lines = message.split('\n');
        lines.forEach(function (line) {
            var finalMessage = (_this.getDateTime() != '' ? _this.getDateTime() + '\t' : '') + line;
            if (!_this.isSilent) {
                _this.send(_this.getColor(type), finalMessage);
            }
            _this.output.push(finalMessage);
        });
        if (type == 'critical') {
            this._hasError = true;
            this.hasCriticalError = true;
        }
        else if (type == 'error') {
            this._hasError = true;
        }
    };
    Log.prototype.send = function (color, line) {
        var _this = this;
        this.target.forEach(function (type) {
            switch (type) {
                case LogTarget.Console:
                    console.log(line.trim());
                    break;
                case LogTarget.File:
                    require('fs').appendFileSync(_this.file, line.trim() + '\n');
                    break;
            }
        });
    };
    return Log;
}());
exports.default = Log;
