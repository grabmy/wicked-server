import Configuration from './Configuration';
import Server from './Server';
import Execution from './Execution';
import LogConsole from './LogConsole';
import Tools from './Tools';

const path = require('path');

export default class Core {
  configuration!: Configuration | null;
  execution!: Execution;
  server!: Server;

  // configuration JSON file
  private configurationFile = '';

  // root path
  private rootPath = process.cwd();

  // True is the server has started
  private hasStarted = false;

  // True if reality is a simulation
  private isSimulated = false;

  private _isRunning = false;

  private _hasRun = false;

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public get hasRun(): boolean {
    return !this._isRunning && this._hasRun;
  }

  constructor(configurationFile: string) {
    this.hasStarted = false;
    this.configurationFile = path.resolve('./' + configurationFile);
    LogConsole.log('Root directory: ' + this.rootPath);
    LogConsole.log('Configuration file: ' + this.configurationFile);

    this.loadConfiguration(this.configurationFile);
  }

  loadConfiguration(path: string = ''): void {
    if (this.hasStarted) {
      this.stop();
    }
    if (this.configuration) {
      this.unloadConfiguration();
    }
    if (!Tools.fileExists(path)) {
      LogConsole.log('Critical error: Configuration file not found: ' + path, 'critical');
      LogConsole.log('Server will not start due to error', 'critical');
      process.exitCode = 1;
      process.exit();
    }

    const newConfiguration = Tools.fileReadJson(this.configurationFile);
    if (newConfiguration === false) {
      LogConsole.log('Critical error: Could not read configuration: ' + path, 'critical');
      LogConsole.log('Server will not start due to error', 'critical');
      process.exitCode = 1;
      process.exit();
    }

    this.configuration = newConfiguration;
  }

  unloadConfiguration(): void {
    this.configuration = null;
  }

  start(): void {
    this._isRunning = true;
    this._hasRun = true;
  }

  stop(): void {
    this._isRunning = false;
  }
}
