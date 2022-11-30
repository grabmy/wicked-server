import Core from './Core';
import LogConsole from './LogConsole';
import Tools from './Tools';
import Configuration from './Configuration';

export default class Wicked {
  core!: Core;

  private _configurationFile: string = 'wicked.config.json';
  private _testMode: boolean = false;
  private _exitOnError: boolean = true;
  private _hasExited = false;
  private _creationMode = false;
  private _version = '0.1';
  private _rootDir: string = process.cwd();

  public get hasRun(): boolean {
    if (!this.core) {
      return false;
    }
    return this.core.hasRun;
  }

  public get isRunning(): boolean {
    if (!this.core) {
      return false;
    }
    return this.core.isRunning;
  }

  constructor(args: Array<string> = []) {
    this.reset();

    if (args.length > 0) {
      this.parseCommandLine(args);
    } else {
      const newArgs = process.argv.filter((item, index) => {
        if (index > 1) return true;
        else return false;
      });
      this.parseCommandLine(newArgs);
    }
    if (this._hasExited) {
      return;
    }
    this.start();
  }

  reset(): void {
    LogConsole.reset();
  }

  logIntro(): void {
    LogConsole.log('*** wicked server v' + this._version + ' ***', 'info');
    LogConsole.log('--------------------------');
    if (!this._exitOnError) {
      LogConsole.log('Option: no exit on error');
    }
    if (LogConsole.noColors) {
      LogConsole.log('Option: no colors');
    }
    if (LogConsole.noDateTime) {
      LogConsole.log('Option: no date and time');
    }
    if (LogConsole.isSilent) {
      LogConsole.log('Option: silent');
    }
    if (this._testMode) {
      LogConsole.log('Option: test mode');
    }
    if (this._creationMode) {
      LogConsole.log('Option: create mode');
    }
  }

  parseCommandLine(args: Array<string>): void {
    for (let index = 0; index < args.length; index++) {
      if (args[index].startsWith('--')) {
        this.priorityOption(args[index]);
      } else {
        this.priorityOption(args[index], args[index + 1]);
        index++;
      }
      if (this._hasExited) {
        return;
      }
    }

    for (let index = 0; index < args.length; index++) {
      if (args[index].startsWith('--')) {
        this.option(args[index]);
      } else {
        this.option(args[index], args[index + 1]);
        index++;
      }
      if (this._hasExited) {
        return;
      }
    }
  }

  priorityOption(command: string, value: string = ''): void {
    switch (command) {
      case '--no-exit':
        this._exitOnError = false;
        break;
      case '--test':
        this._testMode = true;
        break;
      case '--no-colors':
        LogConsole.noColors = true;
        break;
      case '--no-date-time':
        LogConsole.noDateTime = true;
        break;
      case '--create':
        this._creationMode = true;
        break;
      case '--silent':
        LogConsole.isSilent = true;
        break;
      case '-config':
        this._configurationFile = value;
        break;
    }
  }

  option(command: string, value: string = ''): void {
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
  }

  optionError(command: string, value: string): void {
    this.logIntro();
    LogConsole.log('Critical error: Unknown option: ' + command + (value ? ' ' + value : ''), 'critical');
    LogConsole.log('Server will not start due to error', 'critical');
    if (this._exitOnError) {
      process.exit(1);
    }
    this._hasExited = true;
  }

  commandHelp(): void {
    this.logIntro();
    LogConsole.log('Help: instructions to use the wicked server command');
    LogConsole.log('options:');
    LogConsole.log('    -config <path>  : path of the JSON configuration file');
    LogConsole.log('    --no-colors     : remove colors in console message');
    LogConsole.log('    --no-date-time  : remove date and time in console message');
    LogConsole.log("    --no-exit       : don't exit process on error");
    LogConsole.log("    --silent        : don't log message in console");
    LogConsole.log('    --help          : show help');

    this._hasExited = true;
  }

  commandCreation(): void {
    this.logIntro();

    // Create directory for configuration file
    LogConsole.log('Checking configuration directory: ' + Tools.getDir(this._configurationFile));
    if (!Tools.dirExists(this._configurationFile)) {
      LogConsole.log('Configuration directory do not exist');
      const configurationDir = Tools.getDir(this._configurationFile);
      if (!Tools.dirRelativeTo(configurationDir, './')) {
        LogConsole.log('Configuration directory is outside the root directory', 'warning');
        LogConsole.log('The directory will not be created automatically', 'warning');
      } else {
        LogConsole.log('Creating configuration directory ...');
        Tools.dirCreateAll(configurationDir);
        if (!Tools.dirExists(this._configurationFile)) {
          LogConsole.log('Could not create the configuration directory', 'error');
        } else {
          LogConsole.log('Configuration directory created', 'success');
        }
      }
    } else {
      LogConsole.log('Configuration directory already exists', 'success');
    }

    // Create configuration file
    LogConsole.log('Checking configuration file: ' + this._configurationFile);
    if (!Tools.dirExists(Tools.getDir(this._configurationFile))) {
      LogConsole.log('Could not create the configuration file', 'error');
      LogConsole.log('Cannot continue without the configuration file', 'error');
      this._hasExited = true;
      return;
    }
    if (!Tools.fileExists(this._configurationFile)) {
      LogConsole.log('Configuration file do not exist');
      const destination = this._configurationFile;
      const source = require('path').normalize(__dirname + '/../../default.config.json');
      LogConsole.log('Creating configuration file ...');
      Tools.fileCopy(source, destination);
      if (!Tools.fileExists(destination)) {
        LogConsole.log('Could not create the configuration file', 'error');
        this._hasExited = true;
        return;
      }
      LogConsole.log('Configuration file created', 'success');
    } else {
      LogConsole.log('Configuration file already exists', 'success');
    }

    LogConsole.log('Loading the configuration file ...');
    let newConfiguration: Configuration;
    try {
      newConfiguration = new Configuration(Tools.fileReadJson(this._configurationFile));
    } catch (err) {
      LogConsole.log(err + '', 'error');
      LogConsole.log('Could not read the configuration file', 'error');
      this._hasExited = true;
      return;
    }

    LogConsole.log('Configuration file parsed and configuration object created', 'success');
    const publicDirectory = Tools.getDir(newConfiguration.public);
    LogConsole.log('Checking public directory: ' + publicDirectory);
    if (!Tools.dirExists(publicDirectory)) {
      LogConsole.log('Public directory do not exist');
      if (!Tools.dirRelativeTo(publicDirectory, this._rootDir)) {
        LogConsole.log('Public directory is outside the root directory', 'warning');
        LogConsole.log('The directory will not be created automatically', 'warning');
      } else {
        LogConsole.log('Creating public directory ...');
        Tools.dirCreateAll(publicDirectory);
        if (!Tools.dirExists(publicDirectory)) {
          LogConsole.log('Could not create the public directory', 'error');
        }
      }
    } else {
      LogConsole.log('Public directory already exists', 'success');
    }

    this._hasExited = true;
    return;
  }

  start(): Wicked {
    this.logIntro();
    this.core.start();
    return this;
  }

  stop(): void {
    this.core.stop();
  }
}
