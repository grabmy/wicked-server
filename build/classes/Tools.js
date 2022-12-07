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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LogSystem_1 = __importDefault(require("./LogSystem"));
var axios_1 = __importDefault(require("axios"));
var fs = require('fs');
var Tools = /** @class */ (function () {
    function Tools() {
    }
    /*************************************************************
     * Date time
     ************************************************************/
    Tools.getDateTime = function (time) {
        if (time) {
            return new Date(time).toISOString().replace('T', ' ').replace('Z', ' ').trim().split('.')[0];
        }
        return new Date().toISOString().replace('T', ' ').replace('Z', ' ').trim().split('.')[0];
    };
    Tools.getDateTimeMs = function (time) {
        if (time) {
            return new Date(time).toISOString().replace('T', ' ').replace('Z', ' ').trim();
        }
        return new Date().toISOString().replace('T', ' ').replace('Z', ' ').trim();
    };
    /*************************************************************
     * Delay
     ************************************************************/
    Tools.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    /*************************************************************
     * File
     ************************************************************/
    Tools.fileExists = function (path) {
        if (!Tools.pathValidation(path)) {
            return false;
        }
        try {
            if (require('fs').statSync(path).isDirectory()) {
                return false;
            }
            return require('fs').existsSync(path);
        }
        catch (err) {
            // LogConsole.log('' + err, 'error');
            return false;
        }
    };
    Tools.fileCopy = function (source, destination) {
        // No path validation on source
        if (!Tools.pathValidation(destination)) {
            return false;
        }
        try {
            fs.copyFileSync(source, destination);
            return Tools.fileExists(destination);
        }
        catch (err) {
            LogSystem_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.fileDelete = function (path) {
        if (!Tools.pathValidation(path)) {
            return false;
        }
        if (!Tools.fileExists(path)) {
            return true;
        }
        try {
            fs.unlinkSync(path);
            return true;
        }
        catch (err) {
            LogSystem_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.fileRead = function (path) {
        if (!Tools.pathValidation(path)) {
            return false;
        }
        try {
            return fs.readFileSync(path).toString();
        }
        catch (err) {
            LogSystem_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.fileReadJson = function (path) {
        if (!Tools.pathValidation(path)) {
            return false;
        }
        try {
            return JSON.parse(fs.readFileSync(path));
        }
        catch (err) {
            LogSystem_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.fileWrite = function (path, content) {
        if (!Tools.pathValidation(path)) {
            return false;
        }
        try {
            require('fs').writeFileSync(path, content);
            return true;
        }
        catch (err) {
            LogSystem_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.pathValidation = function (path) {
        if (require('path').isAbsolute(path)) {
            LogSystem_1.default.log('Error: Cannot use absolute path "' + path + '"', 'error');
            return false;
        }
        if (require('path').normalize(path).startsWith(require('path').sep)) {
            LogSystem_1.default.log('Error: Cannot use relative path "' + path + '" starting with directory separator', 'error');
            return false;
        }
        return true;
    };
    /*************************************************************
     * Directory
     ************************************************************/
    Tools.dirExists = function (path) {
        if (!Tools.pathValidation(path)) {
            return false;
        }
        var dir = Tools.getDir(path + '/');
        return fs.existsSync(dir);
    };
    Tools.dirRelativeTo = function (path, rootPath) {
        // No path validation for root path
        if (!Tools.pathValidation(path)) {
            return false;
        }
        var dir = require('path').resolve(Tools.getDir(path));
        var rootDir = require('path').resolve(Tools.getDir(rootPath));
        return dir.startsWith(rootDir);
    };
    Tools.dirCreate = function (path) {
        if (!Tools.pathValidation(path)) {
            return false;
        }
        var dir = Tools.getDir(path);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return fs.existsSync(dir);
    };
    Tools.dirCreateAll = function (path) {
        if (!Tools.pathValidation(path)) {
            return false;
        }
        var dirNormalized = require('path').normalize(Tools.getDir(path + '/'));
        var parts = dirNormalized.split(require('path').sep);
        var dir = '';
        parts.forEach(function (nextDir) {
            dir += nextDir + require('path').sep;
            var success = Tools.dirCreate(dir);
            if (!success) {
                return false;
            }
        });
        return true;
    };
    Tools.dirDelete = function (path, recursive) {
        if (recursive === void 0) { recursive = false; }
        if (!Tools.pathValidation(path)) {
            return false;
        }
        if (!Tools.dirExists(path)) {
            return true;
        }
        try {
            fs.rmdirSync(path, { recursive: recursive });
            return true;
        }
        catch (err) {
            LogSystem_1.default.log('' + err, 'error');
            return false;
        }
    };
    Tools.getDir = function (path) {
        if (path.endsWith('/') || path.endsWith('\\')) {
            return require('path').normalize(path);
        }
        return require('path').normalize('./' + require('path').dirname(path) + '/');
    };
    /*************************************************************
     * Request
     ************************************************************/
    Tools.get = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            function getContentType(response) {
                var _a;
                if (!response) {
                    return '';
                }
                var contentType = '';
                if (typeof response.headers.getContentType === 'function') {
                    contentType = ((_a = response.headers.getContentType()) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                }
                else if (typeof response.headers.getContentType === 'string') {
                    contentType = response.headers.getContentType || '';
                }
                return contentType;
            }
            function getMimeType(response) {
                if (!response) {
                    return '';
                }
                var contentType = getContentType(response);
                var parts = contentType.split(';');
                return parts[0];
            }
            function getCharset(response) {
                if (!response) {
                    return '';
                }
                var contentType = getContentType(response);
                var parts = contentType.split(';');
                var charset = '';
                for (var t = 0; t < parts.length; t++) {
                    if (parts[t].trim().toLowerCase().startsWith('charset=')) {
                        charset = parts[t].replace('charset=', '').trim();
                    }
                }
                return charset;
            }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, axios_1.default)(__assign({
                            url: url,
                            method: 'GET',
                            timeout: 8000,
                        }, options))
                            .then(function (response) {
                            var json = null;
                            if ((response === null || response === void 0 ? void 0 : response.data) instanceof Object) {
                                json = response.data;
                            }
                            var result = {
                                response: response,
                                error: null,
                                ok: true,
                                code: response.status,
                                mimeType: getMimeType(response),
                                charset: getCharset(response),
                                html: response.data,
                                json: null,
                            };
                            return result;
                        })
                            .catch(function (error) {
                            var _a, _b, _c, _d, _e, _f;
                            var html = '';
                            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) instanceof String) {
                                html = error.response.data;
                            }
                            var contentType = '';
                            if (typeof ((_b = error.response) === null || _b === void 0 ? void 0 : _b.headers.getContentType) === 'function') {
                                contentType = ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.headers.getContentType()) === null || _d === void 0 ? void 0 : _d.toString()) || '';
                            }
                            else if (typeof ((_e = error.response) === null || _e === void 0 ? void 0 : _e.headers.getContentType) === 'string') {
                                contentType = ((_f = error.response) === null || _f === void 0 ? void 0 : _f.headers.getContentType) || '';
                            }
                            var result = {
                                response: error.response || null,
                                error: error,
                                ok: false,
                                code: error.status || 0,
                                mimeType: getMimeType(error.response),
                                charset: getCharset(error.response),
                                html: html,
                                json: null,
                            };
                            return result;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Tools;
}());
exports.default = Tools;
