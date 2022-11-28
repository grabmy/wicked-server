"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tools_1 = __importDefault(require("./Tools"));
var LogConsole = /** @class */ (function () {
    function LogConsole() {
    }
    LogConsole.reset = function () {
        LogConsole.output = [];
        LogConsole.noColors = false;
        LogConsole.noDateTime = false;
        LogConsole.hasCriticalError = false;
        LogConsole.isSilent = false;
    };
    LogConsole.getColor = function (type) {
        if (type === void 0) { type = ''; }
        if (LogConsole.noColors) {
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
    LogConsole.getDateTime = function () {
        if (LogConsole.noDateTime) {
            return '';
        }
        return '[' + Tools_1.default.getDateTime() + ']';
    };
    LogConsole.log = function (message, type) {
        if (type === void 0) { type = 'regular'; }
        var lines = message.split('\n');
        lines.forEach(function (line) {
            var finalMessage = (LogConsole.getDateTime() != '' ? LogConsole.getDateTime() + '\t' : '') + type + '\t' + line;
            if (!LogConsole.isSilent) {
                var consoleMessage = (LogConsole.getDateTime() != '' ? LogConsole.getDateTime() + '\t' : '') + line;
                console.log(LogConsole.getColor(type), consoleMessage);
            }
            LogConsole.output.push(finalMessage);
        });
        if (type == 'critical') {
            LogConsole.hasCriticalError = true;
        }
    };
    LogConsole.output = [];
    LogConsole.noColors = false;
    LogConsole.noDateTime = false;
    LogConsole.hasCriticalError = false;
    LogConsole.isSilent = false;
    return LogConsole;
}());
exports.default = LogConsole;
