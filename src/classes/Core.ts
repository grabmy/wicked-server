import Configuration from "./Configuration";
import Server from "./Server";
import Execution from "./Execution";
import Log from "./Log";
import LogConsole from "./LogConsole";
import Tools from "./Tools";

const path = require("path");

export default class Core {
  configuration: Configuration | null;
  execution: Execution;
  server: Server;
  log: Log;

  // configuration JSON file
  private configurationFile = "";

  // public path
  private publicPath = "";

  // True is the server has started
  private hasStarted = false;

  // True if reality is a simulation
  private isSimulated = false;

  constructor(configurationFile: string) {
    this.hasStarted = false;
    this.configurationFile = path.resolve("./" + configurationFile);
    LogConsole.criticalLog("Configuration file: " + this.configurationFile);

    this.loadConfiguration(this.configurationFile);
  }

  loadConfiguration(path: string = ""): void {
    if (this.hasStarted) {
      this.stop();
    }
    if (this.configuration) {
      this.unloadConfiguration();
    }
    if (!Tools.fileExists(path)) {
      LogConsole.criticalError("Configuration file not found: " + path);
      process.exitCode = 1;
      process.exit();
    }

    const newConfiguration = Tools.fileRead(this.configurationFile);
    if (newConfiguration === false) {
      LogConsole.criticalError("Could not read configuration: " + path);
      process.exitCode = 1;
      process.exit();
    }

    this.configuration = newConfiguration;
  }

  unloadConfiguration(): void {
    this.configuration = null;
  }

  start(): void {
    //
  }

  stop(): void {
    //
  }
}
