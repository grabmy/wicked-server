import Tools from './Tools';
import LogSystem from './LogSystem';

enum LogTarget {
  Console,
  File,
}

export default class Log {
  public output: Array<string> = [];
  public noColors: boolean = false;
  public noDateTime: boolean = false;
  public hasCriticalError: boolean = false;
  public isSilent: boolean = false;
  public name = '';

  private _target: Array<LogTarget> = [];
  private _file = '';
  private _enabled = true;
  private _hasError = false;

  constructor(name: string, options: any) {
    this.name = name;
    if (!options.enabled) {
      this.enabled = false;
    }

    for (let name in options) {
      switch (name) {
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

  get enabled(): boolean {
    return this._enabled;
  }

  get hasError(): boolean {
    return this._hasError;
  }

  set enabled(enabled: boolean) {
    if (enabled) {
      if (!this.target || this.target.length == 0) {
        return;
      }
      if (!this.file || !Tools.dirExists(Tools.getDir(this.file))) {
        return;
      }
    }
    this._enabled = !!enabled;
  }

  get target(): Array<LogTarget> {
    return this._target;
  }

  set target(newTarget: any) {
    if (typeof newTarget == 'string') {
      this._target = [];
      this.addTarget(newTarget);
    } else if (Array.isArray(newTarget)) {
      this._target = [];
      for (let index = 0; index < newTarget.length; index++) {
        this.addTarget(newTarget[index]);
      }
    } else {
      if (this._enabled) {
        if (this.name != '') {
          LogSystem.log('Invalid configuration for ' + this.name + ' log', 'warning');
        }
        LogSystem.log('Wrong type for log target "' + typeof newTarget + '"', 'warning');
      }
    }
  }

  get file(): string {
    return this._file;
  }

  set file(file: string) {
    // const pathAbsolute = require('fs').resolve(file);
    if (this._enabled) {
      if (!Tools.dirExists(Tools.getDir(file))) {
        if (this.name != '') {
          LogSystem.log('Invalid configuration for ' + this.name + ' log', 'warning');
        }
        LogSystem.log('Directory do not exist "' + Tools.getDir(file) + '"', 'warning');
      }
    }
    this._file = file;
  }

  valid(): boolean {
    if (!Tools.dirExists(Tools.getDir(this.file))) {
      return false;
    }
    if (!this.target || this.target.length == 0) {
      return false;
    }
    return true;
  }

  addTarget(newTarget: string): void {
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
            LogSystem.log('Invalid configuration for ' + this.name + ' log', 'warning');
          }
          LogSystem.log('Unable to create log target "' + newTarget + '"', 'warning');
        }
        break;
    }
  }

  reset(): void {
    this.output = [];
    this.noColors = false;
    this.noDateTime = false;
    this.hasCriticalError = false;
    this.isSilent = false;
    this._hasError = false;
    this._enabled = true;
    this._file = '';
    this._target = [];
  }

  getColor(type: string = '') {
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
  }

  getDateTime() {
    if (this.noDateTime) {
      return '';
    }
    return '[' + Tools.getDateTime() + ']';
  }

  log(message: string, type: string = 'regular'): void {
    if (!this._enabled) {
      return;
    }
    const lines = message.trim().split('\n');
    lines.forEach((line) => {
      if (line.trim() == '') {
        return;
      }
      const finalMessage = (this.getDateTime() != '' ? this.getDateTime() + '\t' : '') + line;
      if (!this.isSilent) {
        this.send(this.getColor(type), finalMessage);
      }
      this.output.push(finalMessage);
    });

    if (type == 'critical') {
      this._hasError = true;
      this.hasCriticalError = true;
    } else if (type == 'error') {
      this._hasError = true;
    }
  }

  private send(color: string, line: string): void {
    this.target.forEach((type) => {
      switch (type) {
        case LogTarget.Console:
          console.log(line.trim());
          break;
        case LogTarget.File:
          require('fs').appendFileSync(this.file, line.trim() + '\n');
          break;
      }
    });
  }
}
