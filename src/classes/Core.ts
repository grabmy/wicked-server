import Configuration from './Configuration';
import Server from './Server';
import LogSystem from './LogSystem';
import Log from './Log';
import Tools from './Tools';

const path = require('path');

const logAccessDefault = {
  target: 'file',
  file: 'log/access.log',
  enabled: false,
};

const logErrorDefault = {
  target: 'file',
  file: 'log/error.log',
  enabled: false,
};

export default class Core {
  public configuration!: Configuration | null;

  public server!: Server | null;

  public logAccess!: Log | null;

  public logError!: Log | null;

  // configuration JSON file
  private configurationFile = '';

  // root path
  private rootPath = process.cwd();

  // True is the server has started
  private hasStarted = false;

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
    this.configurationFile = path.normalize('./' + configurationFile);
    LogSystem.log('Root directory: ' + this.rootPath);
    LogSystem.log('Configuration file: ' + this.configurationFile);
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
      LogSystem.log('Critical error: Configuration file not found: ' + path, 'critical');
      LogSystem.log('Server will not start due to error', 'critical');
      this.stop();
      return;
    }

    const newConfiguration = Tools.fileReadJson(this.configurationFile);
    if (newConfiguration === false) {
      LogSystem.log('Critical error: Could not read configuration: ' + path, 'critical');
      LogSystem.log('Server will not start due to error', 'critical');
      this.stop();
      return;
    }

    this.logAccess = new Log('access', { ...logAccessDefault, ...newConfiguration.log.access });
    this.logError = new Log('error', { ...logErrorDefault, ...newConfiguration.log.error });

    this.configuration = newConfiguration;
  }

  unloadConfiguration(): void {
    this.configuration = null;
  }

  start(): void {
    if (this.configuration == null) {
      LogSystem.log('Cannot start server with no configuration loaded', 'critical');
      return;
    }
    if (!Tools.dirExists(this.configuration.public)) {
      LogSystem.log('Cannot start server with no public directory created', 'critical');
      return;
    }
    LogSystem.log('Web server is starting');
    this._isRunning = true;
    this._hasRun = true;

    this.server = new Server(this, this.configuration);
    this.server.start();
  }

  async stop(): Promise<any> {
    if (!this._isRunning) {
      LogSystem.log('Stop: Web server is not running');
      return;
    }
    LogSystem.log('Web server is stopping');
    await this.server?.stop();
    this._isRunning = false;
  }
}
