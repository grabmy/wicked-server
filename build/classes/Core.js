"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LogConsole_1 = __importDefault(require("./LogConsole"));
var Tools_1 = __importDefault(require("./Tools"));
var path = require('path');
var Core = /** @class */ (function () {
    function Core(configurationFile) {
        // configuration JSON file
        this.configurationFile = '';
        // root path
        this.rootPath = process.cwd();
        // True is the server has started
        this.hasStarted = false;
        // True if reality is a simulation
        this.isSimulated = false;
        this._isRunning = false;
        this._hasRun = false;
        this.hasStarted = false;
        this.configurationFile = path.resolve('./' + configurationFile);
        LogConsole_1.default.log('Root directory: ' + this.rootPath);
        LogConsole_1.default.log('Configuration file: ' + this.configurationFile);
        this.loadConfiguration(this.configurationFile);
    }
    Object.defineProperty(Core.prototype, "isRunning", {
        get: function () {
            return this._isRunning;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Core.prototype, "hasRun", {
        get: function () {
            return !this._isRunning && this._hasRun;
        },
        enumerable: false,
        configurable: true
    });
    Core.prototype.loadConfiguration = function (path) {
        if (path === void 0) { path = ''; }
        if (this.hasStarted) {
            this.stop();
        }
        if (this.configuration) {
            this.unloadConfiguration();
        }
        if (!Tools_1.default.fileExists(path)) {
            LogConsole_1.default.log('Critical error: Configuration file not found: ' + path, 'critical');
            LogConsole_1.default.log('Server will not start due to error', 'critical');
            process.exitCode = 1;
            process.exit();
        }
        var newConfiguration = Tools_1.default.fileReadJson(this.configurationFile);
        if (newConfiguration === false) {
            LogConsole_1.default.log('Critical error: Could not read configuration: ' + path, 'critical');
            LogConsole_1.default.log('Server will not start due to error', 'critical');
            process.exitCode = 1;
            process.exit();
        }
        this.configuration = newConfiguration;
    };
    Core.prototype.unloadConfiguration = function () {
        this.configuration = null;
    };
    Core.prototype.start = function () {
        this._isRunning = true;
        this._hasRun = true;
    };
    Core.prototype.stop = function () {
        this._isRunning = false;
    };
    return Core;
}());
exports.default = Core;
