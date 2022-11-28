"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LogConsole_1 = __importDefault(require("./LogConsole"));
var fs = require('fs');
var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.getDateTime = function () {
        return new Date().toISOString().replace('T', ' ').replace('Z', ' ').trim();
    };
    Tools.fileExists = function (path) {
        try {
            return require('fs').existsSync(path);
        }
        catch (err) {
            LogConsole_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.dirExists = function (path) {
        var dir = Tools.getDir(path);
        return fs.existsSync(dir);
    };
    Tools.dirCreate = function (path) {
        console.log('dirCreate: path = ' + path);
        var dir = Tools.getDir(path + '\\');
        console.log('dirCreate: dir = ' + dir);
        if (!fs.existsSync(dir)) {
            console.log('dirCreate: creating ...');
            fs.mkdirSync(dir);
        }
        console.log('dirCreate: done, ' + fs.existsSync(dir));
        return fs.existsSync(dir);
    };
    Tools.fileCopy = function (source, destination) {
        try {
            fs.copyFileSync(source, destination);
            return Tools.fileExists(destination);
        }
        catch (err) {
            LogConsole_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.fileDelete = function (path) {
        try {
            fs.unlinkSync(path);
            return true;
        }
        catch (err) {
            LogConsole_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.fileRead = function (path) {
        try {
            return fs.readFileSync(path).toString();
        }
        catch (err) {
            LogConsole_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.fileReadJson = function (path) {
        try {
            return JSON.parse(fs.readFileSync(path));
        }
        catch (err) {
            LogConsole_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.getDir = function (path) {
        if (path.endsWith('/') || path.endsWith('\\')) {
            return path;
        }
        return require('path').normalize('./' + require('path').dirname(path) + '/');
    };
    Tools.getAbsoluteDir = function (path) {
        console.log('getAbsoluteDir: path = ' + path);
        return require('path').dirname(require('path').resolve(path));
    };
    Tools.getAbsoluteFile = function (path) {
        return require('path').resolve(path);
    };
    return Tools;
}());
exports.default = Tools;
