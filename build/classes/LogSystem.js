"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tools_1 = __importDefault(require("./Tools"));
var LogSystem = /** @class */ (function () {
    function LogSystem() {
    }
    LogSystem.reset = function () {
        LogSystem.output = [];
        LogSystem.noColors = false;
        LogSystem.noDateTime = false;
        LogSystem.hasCriticalError = false;
        LogSystem.hasError = false;
    };
    LogSystem.getColor = function (type) {
        if (type === void 0) { type = ''; }
        if (LogSystem.noColors) {
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
    LogSystem.getDateTime = function () {
        if (LogSystem.noDateTime) {
            return '';
        }
        return '[' + Tools_1.default.getDateTime() + ']';
    };
    LogSystem.log = function (message, type) {
        if (type === void 0) { type = 'regular'; }
        var lines = message.split('\n');
        lines.forEach(function (line) {
            var finalMessage = (LogSystem.getDateTime() != '' ? LogSystem.getDateTime() + '\t' : '') + type + '\t' + line;
            if (!LogSystem.isSilent) {
                var consoleMessage = (LogSystem.getDateTime() != '' ? LogSystem.getDateTime() + '\t' : '') + line;
                console.log(LogSystem.getColor(type), consoleMessage);
            }
            LogSystem.output.push(finalMessage);
        });
        if (type == 'critical') {
            LogSystem.hasError = true;
            LogSystem.hasCriticalError = true;
        }
        else if (type == 'error') {
            LogSystem.hasError = true;
        }
    };
    LogSystem.output = [];
    LogSystem.noColors = false;
    LogSystem.noDateTime = false;
    LogSystem.hasCriticalError = false;
    LogSystem.hasError = false;
    LogSystem.isSilent = false;
    return LogSystem;
}());
exports.default = LogSystem;
//# sourceMappingURL=LogSystem.js.map