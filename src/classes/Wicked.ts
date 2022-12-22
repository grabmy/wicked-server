import Core from './Core';
import LogSystem from './LogSystem';
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
    LogSystem.reset();
  }

  logIntro(): void {
    LogSystem.log('*** wicked server v' + this._version + ' ***', 'info');
    LogSystem.log('--------------------------');
    if (!this._exitOnError) {
      LogSystem.log('Option: no exit on error');
    }
    if (LogSystem.noColors) {
      LogSystem.log('Option: no colors');
    }
    if (LogSystem.noDateTime) {
      LogSystem.log('Option: no date and time');
    }
    if (LogSystem.isSilent) {
      LogSystem.log('Option: silent');
    }
    if (this._testMode) {
      LogSystem.log('Option: test mode');
    }
    if (this._creationMode) {
      LogSystem.log('Option: create mode');
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
        LogSystem.noColors = true;
        break;
      case '--no-date-time':
        LogSystem.noDateTime = true;
        break;
      case '--create':
        this._creationMode = true;
        break;
      case '--silent':
        LogSystem.isSilent = true;
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
    LogSystem.log('Critical error: Unknown option: ' + command + (value ? ' ' + value : ''), 'critical');
    LogSystem.log('Server will not start due to error', 'critical');
    if (this._exitOnError) {
      process.exit(1);
    }
    this._hasExited = true;
  }

  commandHelp(): void {
    this.logIntro();
    LogSystem.log('Help: instructions to use the wicked server command');
    LogSystem.log('options:');
    LogSystem.log('    -config <path>  : path of the JSON configuration file');
    LogSystem.log('    --no-colors     : remove colors in console message');
    LogSystem.log('    --no-date-time  : remove date and time in console message');
    LogSystem.log("    --no-exit       : don't exit process on error");
    LogSystem.log("    --silent        : don't log message in console");
    LogSystem.log('    --help          : show help');

    this._hasExited = true;
  }

  commandCreation(): void {
    this.logIntro();

    // Create directory for configuration file
    LogSystem.log('Checking configuration directory: ' + Tools.getDir(this._configurationFile));
    if (!Tools.dirExists(this._configurationFile)) {
      LogSystem.log('Configuration directory do not exist');
      const configurationDir = Tools.getDir(this._configurationFile);
      if (!Tools.dirRelativeTo(configurationDir, './')) {
        LogSystem.log('Configuration directory is outside the root directory', 'warning');
        LogSystem.log('The directory will not be created automatically', 'warning');
      } else {
        LogSystem.log('Creating configuration directory ...');
        Tools.dirCreateAll(configurationDir);
        if (!Tools.dirExists(this._configurationFile)) {
          LogSystem.log('Could not create the configuration directory', 'error');
        } else {
          LogSystem.log('Configuration directory created', 'success');
        }
      }
    } else {
      LogSystem.log('Configuration directory already exists', 'success');
    }

    // Create configuration file
    LogSystem.log('Checking configuration file: ' + this._configurationFile);
    if (!Tools.dirExists(Tools.getDir(this._configurationFile))) {
      LogSystem.log('Could not create the configuration file', 'error');
      LogSystem.log('Cannot continue without the configuration file', 'error');
      this._hasExited = true;
      return;
    }
    if (!Tools.fileExists(this._configurationFile)) {
      LogSystem.log('Configuration file do not exist');
      const destination = this._configurationFile;
      const source = require('path').normalize(__dirname + '/../../default.config.json');
      LogSystem.log('Creating configuration file ...');
      Tools.fileCopy(source, destination);
      if (!Tools.fileExists(destination)) {
        LogSystem.log('Could not create the configuration file', 'error');
        this._hasExited = true;
        return;
      }
      LogSystem.log('Configuration file created', 'success');
    } else {
      LogSystem.log('Configuration file already exists', 'success');
    }

    LogSystem.log('Loading the configuration file ...');
    let newConfiguration: Configuration;
    try {
      newConfiguration = new Configuration(Tools.fileReadJson(this._configurationFile));
    } catch (err) {
      LogSystem.log(err + '', 'error');
      LogSystem.log('Could not read the configuration file', 'error');
      this._hasExited = true;
      return;
    }

    LogSystem.log('Configuration file parsed and configuration object created', 'success');
    const publicDirectory = Tools.getDir(newConfiguration.public);
    LogSystem.log('Checking public directory: ' + publicDirectory);
    if (!Tools.dirExists(publicDirectory)) {
      LogSystem.log('Public directory do not exist');
      if (!Tools.dirRelativeTo(publicDirectory, this._rootDir)) {
        LogSystem.log('Public directory is outside the root directory', 'warning');
        LogSystem.log('The directory will not be created automatically', 'warning');
      } else {
        LogSystem.log('Creating public directory ...');
        Tools.dirCreateAll(publicDirectory);
        if (!Tools.dirExists(publicDirectory)) {
          LogSystem.log('Could not create the public directory', 'error');
        }
      }
    } else {
      LogSystem.log('Public directory already exists', 'success');
    }

    if (
      (typeof newConfiguration.log?.access.target == 'string' && newConfiguration.log?.access.target == 'file') ||
      (Array.isArray(newConfiguration.log?.access.target) && newConfiguration.log?.access.target.includes('file'))
    ) {
      const accessLogDirectory = Tools.getDir(newConfiguration.log.access.path);
      LogSystem.log('Log access writen in a file: ' + accessLogDirectory);
      if (!Tools.dirExists(accessLogDirectory)) {
        LogSystem.log('Access log directory do not exist');
        if (!Tools.dirRelativeTo(accessLogDirectory, this._rootDir)) {
          LogSystem.log('Access log directory is outside the root directory', 'warning');
          LogSystem.log('The directory will not be created automatically', 'warning');
        } else {
          LogSystem.log('Creating access log directory ...');
          Tools.dirCreateAll(accessLogDirectory);
          if (!Tools.dirExists(accessLogDirectory)) {
            LogSystem.log('Could not create the access log directory', 'error');
          }
        }
      } else {
        LogSystem.log('Access log directory already exists', 'success');
      }
    } else {
      LogSystem.log('Access log not writen in a file');
    }

    if (
      (typeof newConfiguration.log?.error.target == 'string' && newConfiguration.log?.error.target == 'file') ||
      (Array.isArray(newConfiguration.log?.error.target) && newConfiguration.log?.error.target.includes('file'))
    ) {
      const errorLogDirectory = Tools.getDir(newConfiguration.log.error.path);
      LogSystem.log('Log error writen in a file: ' + errorLogDirectory);
      if (!Tools.dirExists(errorLogDirectory)) {
        LogSystem.log('Error log directory do not exist');
        if (!Tools.dirRelativeTo(errorLogDirectory, this._rootDir)) {
          LogSystem.log('Error log directory is outside the root directory', 'warning');
          LogSystem.log('The directory will not be created automatically', 'warning');
        } else {
          LogSystem.log('Creating error log directory ...');
          Tools.dirCreateAll(errorLogDirectory);
          if (!Tools.dirExists(errorLogDirectory)) {
            LogSystem.log('Could not create the error log directory', 'error');
          }
        }
      } else {
        LogSystem.log('Error log directory already exists', 'success');
      }
    } else {
      LogSystem.log('Error log not writen in a file');
    }

    this._hasExited = true;
    return;
  }

  start(): Wicked {
    this.logIntro();
    this.core = new Core(this._configurationFile);
    this.core.start();
    return this;
  }

  async stop(): Promise<void> {
    return await this.core.stop();
  }
}
