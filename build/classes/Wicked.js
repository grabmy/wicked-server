"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Core_1 = __importDefault(require("./Core"));
var LogSystem_1 = __importDefault(require("./LogSystem"));
var Tools_1 = __importDefault(require("./Tools"));
var Configuration_1 = __importDefault(require("./Configuration"));
var Wicked = /** @class */ (function () {
    function Wicked(args) {
        if (args === void 0) { args = []; }
        this._configurationFile = 'wicked.config.json';
        this._testMode = false;
        this._exitOnError = true;
        this._hasExited = false;
        this._creationMode = false;
        this._version = '0.1';
        this._rootDir = process.cwd();
        this.reset();
        if (args.length > 0) {
            this.parseCommandLine(args);
        }
        else {
            var newArgs = process.argv.filter(function (item, index) {
                if (index > 1)
                    return true;
                else
                    return false;
            });
            this.parseCommandLine(newArgs);
        }
        if (this._hasExited) {
            return;
        }
        this.start();
    }
    Object.defineProperty(Wicked.prototype, "hasRun", {
        get: function () {
            if (!this.core) {
                return false;
            }
            return this.core.hasRun;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wicked.prototype, "isRunning", {
        get: function () {
            if (!this.core) {
                return false;
            }
            return this.core.isRunning;
        },
        enumerable: false,
        configurable: true
    });
    Wicked.prototype.reset = function () {
        LogSystem_1.default.reset();
    };
    Wicked.prototype.logIntro = function () {
        LogSystem_1.default.log('*** wicked server v' + this._version + ' ***', 'info');
        LogSystem_1.default.log('--------------------------');
        if (!this._exitOnError) {
            LogSystem_1.default.log('Option: no exit on error');
        }
        if (LogSystem_1.default.noColors) {
            LogSystem_1.default.log('Option: no colors');
        }
        if (LogSystem_1.default.noDateTime) {
            LogSystem_1.default.log('Option: no date and time');
        }
        if (LogSystem_1.default.isSilent) {
            LogSystem_1.default.log('Option: silent');
        }
        if (this._testMode) {
            LogSystem_1.default.log('Option: test mode');
        }
        if (this._creationMode) {
            LogSystem_1.default.log('Option: create mode');
        }
    };
    Wicked.prototype.parseCommandLine = function (args) {
        for (var index = 0; index < args.length; index++) {
            if (args[index].startsWith('--')) {
                this.priorityOption(args[index]);
            }
            else {
                this.priorityOption(args[index], args[index + 1]);
                index++;
            }
            if (this._hasExited) {
                return;
            }
        }
        for (var index = 0; index < args.length; index++) {
            if (args[index].startsWith('--')) {
                this.option(args[index]);
            }
            else {
                this.option(args[index], args[index + 1]);
                index++;
            }
            if (this._hasExited) {
                return;
            }
        }
    };
    Wicked.prototype.priorityOption = function (command, value) {
        if (value === void 0) { value = ''; }
        switch (command) {
            case '--no-exit':
                this._exitOnError = false;
                break;
            case '--test':
                this._testMode = true;
                break;
            case '--no-colors':
                LogSystem_1.default.noColors = true;
                break;
            case '--no-date-time':
                LogSystem_1.default.noDateTime = true;
                break;
            case '--create':
                this._creationMode = true;
                break;
            case '--silent':
                LogSystem_1.default.isSilent = true;
                break;
            case '-config':
                this._configurationFile = value;
                break;
        }
    };
    Wicked.prototype.option = function (command, value) {
        if (value === void 0) { value = ''; }
        switch (command) {
            case '--no-exit':
            case '--test':
            case '--no-colors':
            case '--no-date-time':
            case '--silent':
            case '-config':
                break;
            case '--help':
                this.commandHelp();
                return;
            case '--create':
                this.commandCreation();
                break;
            default:
                this.optionError(command, value);
                return;
        }
    };
    Wicked.prototype.optionError = function (command, value) {
        this.logIntro();
        LogSystem_1.default.log('Critical error: Unknown option: ' + command + (value ? ' ' + value : ''), 'critical');
        LogSystem_1.default.log('Server will not start due to error', 'critical');
        if (this._exitOnError) {
            process.exit(1);
        }
        this._hasExited = true;
    };
    Wicked.prototype.commandHelp = function () {
        this.logIntro();
        LogSystem_1.default.log('Help: instructions to use the wicked server command');
        LogSystem_1.default.log('options:');
        LogSystem_1.default.log('    -config <path>  : path of the JSON configuration file');
        LogSystem_1.default.log('    --no-colors     : remove colors in console message');
        LogSystem_1.default.log('    --no-date-time  : remove date and time in console message');
        LogSystem_1.default.log("    --no-exit       : don't exit process on error");
        LogSystem_1.default.log("    --silent        : don't log message in console");
        LogSystem_1.default.log('    --help          : show help');
        this._hasExited = true;
    };
    Wicked.prototype.commandCreation = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.logIntro();
        // Create directory for configuration file
        LogSystem_1.default.log('Checking configuration directory: ' + Tools_1.default.getDir(this._configurationFile));
        if (!Tools_1.default.dirExists(this._configurationFile)) {
            LogSystem_1.default.log('Configuration directory do not exist');
            var configurationDir = Tools_1.default.getDir(this._configurationFile);
            if (!Tools_1.default.dirRelativeTo(configurationDir, './')) {
                LogSystem_1.default.log('Configuration directory is outside the root directory', 'warning');
                LogSystem_1.default.log('The directory will not be created automatically', 'warning');
            }
            else {
                LogSystem_1.default.log('Creating configuration directory ...');
                Tools_1.default.dirCreateAll(configurationDir);
                if (!Tools_1.default.dirExists(this._configurationFile)) {
                    LogSystem_1.default.log('Could not create the configuration directory', 'error');
                }
                else {
                    LogSystem_1.default.log('Configuration directory created', 'success');
                }
            }
        }
        else {
            LogSystem_1.default.log('Configuration directory already exists', 'success');
        }
        // Create configuration file
        LogSystem_1.default.log('Checking configuration file: ' + this._configurationFile);
        if (!Tools_1.default.dirExists(Tools_1.default.getDir(this._configurationFile))) {
            LogSystem_1.default.log('Could not create the configuration file', 'error');
            LogSystem_1.default.log('Cannot continue without the configuration file', 'error');
            this._hasExited = true;
            return;
        }
        if (!Tools_1.default.fileExists(this._configurationFile)) {
            LogSystem_1.default.log('Configuration file do not exist');
            var destination = this._configurationFile;
            var source = require('path').normalize(__dirname + '/../../default.config.json');
            LogSystem_1.default.log('Creating configuration file ...');
            Tools_1.default.fileCopy(source, destination);
            if (!Tools_1.default.fileExists(destination)) {
                LogSystem_1.default.log('Could not create the configuration file', 'error');
                this._hasExited = true;
                return;
            }
            LogSystem_1.default.log('Configuration file created', 'success');
        }
        else {
            LogSystem_1.default.log('Configuration file already exists', 'success');
        }
        LogSystem_1.default.log('Loading the configuration file ...');
        var newConfiguration;
        try {
            newConfiguration = new Configuration_1.default(Tools_1.default.fileReadJson(this._configurationFile));
        }
        catch (err) {
            LogSystem_1.default.log(err + '', 'error');
            LogSystem_1.default.log('Could not read the configuration file', 'error');
            this._hasExited = true;
            return;
        }
        LogSystem_1.default.log('Configuration file parsed and configuration object created', 'success');
        var publicDirectory = Tools_1.default.getDir(newConfiguration.public);
        LogSystem_1.default.log('Checking public directory: ' + publicDirectory);
        if (!Tools_1.default.dirExists(publicDirectory)) {
            LogSystem_1.default.log('Public directory do not exist');
            if (!Tools_1.default.dirRelativeTo(publicDirectory, this._rootDir)) {
                LogSystem_1.default.log('Public directory is outside the root directory', 'warning');
                LogSystem_1.default.log('The directory will not be created automatically', 'warning');
            }
            else {
                LogSystem_1.default.log('Creating public directory ...');
                Tools_1.default.dirCreateAll(publicDirectory);
                if (!Tools_1.default.dirExists(publicDirectory)) {
                    LogSystem_1.default.log('Could not create the public directory', 'error');
                }
            }
        }
        else {
            LogSystem_1.default.log('Public directory already exists', 'success');
        }
        if ((typeof ((_a = newConfiguration.log) === null || _a === void 0 ? void 0 : _a.access.target) == 'string' && ((_b = newConfiguration.log) === null || _b === void 0 ? void 0 : _b.access.target) == 'file') ||
            (Array.isArray((_c = newConfiguration.log) === null || _c === void 0 ? void 0 : _c.access.target) && ((_d = newConfiguration.log) === null || _d === void 0 ? void 0 : _d.access.target.includes('file')))) {
            var accessLogDirectory = Tools_1.default.getDir(newConfiguration.log.access.path);
            LogSystem_1.default.log('Log access writen in a file: ' + accessLogDirectory);
            if (!Tools_1.default.dirExists(accessLogDirectory)) {
                LogSystem_1.default.log('Access log directory do not exist');
                if (!Tools_1.default.dirRelativeTo(accessLogDirectory, this._rootDir)) {
                    LogSystem_1.default.log('Access log directory is outside the root directory', 'warning');
                    LogSystem_1.default.log('The directory will not be created automatically', 'warning');
                }
                else {
                    LogSystem_1.default.log('Creating access log directory ...');
                    Tools_1.default.dirCreateAll(accessLogDirectory);
                    if (!Tools_1.default.dirExists(accessLogDirectory)) {
                        LogSystem_1.default.log('Could not create the access log directory', 'error');
                    }
                }
            }
            else {
                LogSystem_1.default.log('Access log directory already exists', 'success');
            }
        }
        else {
            LogSystem_1.default.log('Access log not writen in a file');
        }
        if ((typeof ((_e = newConfiguration.log) === null || _e === void 0 ? void 0 : _e.error.target) == 'string' && ((_f = newConfiguration.log) === null || _f === void 0 ? void 0 : _f.error.target) == 'file') ||
            (Array.isArray((_g = newConfiguration.log) === null || _g === void 0 ? void 0 : _g.error.target) && ((_h = newConfiguration.log) === null || _h === void 0 ? void 0 : _h.error.target.includes('file')))) {
            var errorLogDirectory = Tools_1.default.getDir(newConfiguration.log.error.path);
            LogSystem_1.default.log('Log error writen in a file: ' + errorLogDirectory);
            if (!Tools_1.default.dirExists(errorLogDirectory)) {
                LogSystem_1.default.log('Error log directory do not exist');
                if (!Tools_1.default.dirRelativeTo(errorLogDirectory, this._rootDir)) {
                    LogSystem_1.default.log('Error log directory is outside the root directory', 'warning');
                    LogSystem_1.default.log('The directory will not be created automatically', 'warning');
                }
                else {
                    LogSystem_1.default.log('Creating error log directory ...');
                    Tools_1.default.dirCreateAll(errorLogDirectory);
                    if (!Tools_1.default.dirExists(errorLogDirectory)) {
                        LogSystem_1.default.log('Could not create the error log directory', 'error');
                    }
                }
            }
            else {
                LogSystem_1.default.log('Error log directory already exists', 'success');
            }
        }
        else {
            LogSystem_1.default.log('Error log not writen in a file');
        }
        this._hasExited = true;
        return;
    };
    Wicked.prototype.start = function () {
        this.logIntro();
        this.core = new Core_1.default(this._configurationFile);
        this.core.start();
        return this;
    };
    Wicked.prototype.stop = function () {
        this.core.stop();
    };
    return Wicked;
}());
exports.default = Wicked;
