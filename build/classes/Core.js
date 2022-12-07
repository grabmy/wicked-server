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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Server_1 = __importDefault(require("./Server"));
var LogSystem_1 = __importDefault(require("./LogSystem"));
var Log_1 = __importDefault(require("./Log"));
var Tools_1 = __importDefault(require("./Tools"));
var path = require('path');
var logAccessDefault = {
    target: 'file',
    file: 'log/access.log',
    enabled: false,
};
var logErrorDefault = {
    target: 'file',
    file: 'log/error.log',
    enabled: false,
};
var Core = /** @class */ (function () {
    function Core(configurationFile) {
        // configuration JSON file
        this.configurationFile = '';
        // root path
        this.rootPath = process.cwd();
        // True is the server has started
        this.hasStarted = false;
        this._isRunning = false;
        this._hasRun = false;
        this.hasStarted = false;
        this.configurationFile = path.normalize('./' + configurationFile);
        LogSystem_1.default.log('Root directory: ' + this.rootPath);
        LogSystem_1.default.log('Configuration file: ' + this.configurationFile);
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
            LogSystem_1.default.log('Critical error: Configuration file not found: ' + path, 'critical');
            LogSystem_1.default.log('Server will not start due to error', 'critical');
            this.stop();
            return;
        }
        var newConfiguration = Tools_1.default.fileReadJson(this.configurationFile);
        if (newConfiguration === false) {
            LogSystem_1.default.log('Critical error: Could not read configuration: ' + path, 'critical');
            LogSystem_1.default.log('Server will not start due to error', 'critical');
            this.stop();
            return;
        }
        this.logAccess = new Log_1.default('access', __assign(__assign({}, logAccessDefault), newConfiguration.log.access));
        this.logError = new Log_1.default('error', __assign(__assign({}, logErrorDefault), newConfiguration.log.error));
        this.configuration = newConfiguration;
    };
    Core.prototype.unloadConfiguration = function () {
        this.configuration = null;
    };
    Core.prototype.start = function () {
        if (this.configuration == null) {
            LogSystem_1.default.log('Cannot start server with no configuration loaded', 'critical');
            return;
        }
        if (!Tools_1.default.dirExists(this.configuration.public)) {
            LogSystem_1.default.log('Cannot start server with no public directory created', 'critical');
            return;
        }
        LogSystem_1.default.log('Web server is starting');
        this._isRunning = true;
        this._hasRun = true;
        this.server = new Server_1.default(this, this.configuration);
        this.server.start();
    };
    Core.prototype.stop = function () {
        var _a;
        if (!this._isRunning) {
            LogSystem_1.default.log('Stop: Web server is not running');
            return;
        }
        LogSystem_1.default.log('Web server is stopping');
        (_a = this.server) === null || _a === void 0 ? void 0 : _a.stop();
        this._isRunning = false;
    };
    return Core;
}());
exports.default = Core;
