"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LogConsole_1 = __importDefault(require("./LogConsole"));
var Tools_1 = __importDefault(require("./Tools"));
var Configuration_1 = __importDefault(require("./Configuration"));
var Wicked = /** @class */ (function () {
    function Wicked(args) {
        if (args === void 0) { args = []; }
        this._configurtionFile = 'wicked.config.json';
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
        LogConsole_1.default.reset();
    };
    Wicked.prototype.logIntro = function () {
        LogConsole_1.default.log('*** wicked server v' + this._version + ' ***', 'info');
        LogConsole_1.default.log('--------------------------');
        if (!this._exitOnError) {
            LogConsole_1.default.log('Option: no exit on error');
        }
        if (LogConsole_1.default.noColors) {
            LogConsole_1.default.log('Option: no colors');
        }
        if (LogConsole_1.default.noDateTime) {
            LogConsole_1.default.log('Option: no date and time');
        }
        if (LogConsole_1.default.isSilent) {
            LogConsole_1.default.log('Option: silent');
        }
        if (this._testMode) {
            LogConsole_1.default.log('Option: test mode');
        }
        if (this._creationMode) {
            LogConsole_1.default.log('Option: create mode');
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
                LogConsole_1.default.noColors = true;
                break;
            case '--no-date-time':
                LogConsole_1.default.noDateTime = true;
                break;
            case '--create':
                this._creationMode = true;
                break;
            case '--silent':
                LogConsole_1.default.isSilent = true;
                break;
            case '-config':
                this._configurtionFile = value;
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
        LogConsole_1.default.log('Critical error: Unknown option: ' + command + (value ? ' ' + value : ''), 'critical');
        LogConsole_1.default.log('Server will not start due to error', 'critical');
        if (this._exitOnError) {
            process.exit(1);
        }
        this._hasExited = true;
    };
    Wicked.prototype.commandHelp = function () {
        this.logIntro();
        LogConsole_1.default.log('options:');
        LogConsole_1.default.log('    -config <path>  : path of the JSON configuration file');
        LogConsole_1.default.log('    --no-colors     : remove colors in console message');
        LogConsole_1.default.log('    --no-date-time  : remove date and time in console message');
        LogConsole_1.default.log("    --no-exit       : don't exit process on error");
        LogConsole_1.default.log("    --silent        : don't log message in console");
        LogConsole_1.default.log('    --help          : show help');
        this._hasExited = true;
    };
    Wicked.prototype.commandCreation = function () {
        this.logIntro();
        // Create directory for configuration file
        LogConsole_1.default.log('Checking configuration directory: ' + Tools_1.default.getDir(this._configurtionFile));
        if (!Tools_1.default.dirExists(this._configurtionFile)) {
            LogConsole_1.default.log('Configuration directory do not exist');
            var configurationDir = Tools_1.default.getAbsoluteDir(this._configurtionFile);
            var rootDir = Tools_1.default.getAbsoluteDir(this._rootDir);
            if (!configurationDir.startsWith(rootDir)) {
                LogConsole_1.default.log('Configuration directory is outside the root directory', 'warning');
                LogConsole_1.default.log('The directory will not be created automatically', 'warning');
            }
            else {
                LogConsole_1.default.log('Creating configuration directory ...');
                Tools_1.default.dirCreate(configurationDir);
                if (!Tools_1.default.dirExists(this._configurtionFile)) {
                    LogConsole_1.default.log('Could not create the configuration directory', 'error');
                }
                else {
                    LogConsole_1.default.log('Configuration directory created', 'success');
                }
            }
        }
        else {
            LogConsole_1.default.log('Configuration directory already exists', 'success');
        }
        // Create configuration file
        LogConsole_1.default.log('Checking configuration file: ' + Tools_1.default.getAbsoluteFile(this._configurtionFile));
        if (!Tools_1.default.dirExists(this._configurtionFile)) {
            LogConsole_1.default.log('Could not create the configuration file', 'error');
            LogConsole_1.default.log('Cannot continue without the configuration file', 'error');
            this._hasExited = true;
            return;
        }
        if (!Tools_1.default.fileExists(this._configurtionFile)) {
            LogConsole_1.default.log('Configuration file do not exist');
            var destination = Tools_1.default.getAbsoluteFile(this._configurtionFile);
            var source = Tools_1.default.getAbsoluteFile(__dirname + '/../../default.config.json');
            console.log('source = ' + source + ', destination = ' + destination);
            LogConsole_1.default.log('Creating configuration file ...');
            Tools_1.default.fileCopy(source, destination);
            if (!Tools_1.default.fileExists(destination)) {
                LogConsole_1.default.log('Could not create the configuration file', 'error');
                this._hasExited = true;
                return;
            }
            LogConsole_1.default.log('Configuration file created', 'success');
        }
        else {
            LogConsole_1.default.log('Configuration file already exists', 'success');
        }
        LogConsole_1.default.log('Loading the configuration file ...');
        var newConfiguration;
        try {
            newConfiguration = new Configuration_1.default(Tools_1.default.fileReadJson(this._configurtionFile));
        }
        catch (err) {
            LogConsole_1.default.log(err + '', 'error');
            LogConsole_1.default.log('Could not read the configuration file', 'error');
            this._hasExited = true;
            return;
        }
        LogConsole_1.default.log('Configuration file parsed and configuration object created', 'success');
        console.log(newConfiguration.public);
        var publicDirectory = Tools_1.default.getDir(newConfiguration.public);
        console.log('publicDirectory = ' + publicDirectory);
        LogConsole_1.default.log('Checking public directory: ' + publicDirectory);
        if (!Tools_1.default.dirExists(publicDirectory)) {
            LogConsole_1.default.log('Public directory do not exist');
            var rootDir = Tools_1.default.getAbsoluteDir(this._rootDir);
            if (!publicDirectory.startsWith(rootDir)) {
                LogConsole_1.default.log('Public directory is outside the root directory', 'warning');
                LogConsole_1.default.log('The directory will not be created automatically', 'warning');
            }
            else {
                LogConsole_1.default.log('Creating public directory ...');
                Tools_1.default.dirCreate(publicDirectory);
                if (!Tools_1.default.dirExists(publicDirectory)) {
                    LogConsole_1.default.log('Could not create the public directory', 'error');
                }
            }
        }
        else {
            LogConsole_1.default.log('Public directory already exists', 'success');
        }
        this._hasExited = true;
        return;
    };
    Wicked.prototype.start = function () {
        this.logIntro();
        this.core.start();
        return this;
    };
    Wicked.prototype.stop = function () {
        this.core.stop();
    };
    return Wicked;
}());
exports.default = Wicked;
