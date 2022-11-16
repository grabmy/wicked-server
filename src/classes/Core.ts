import Configuration from "./Configuration";
import Server from "./Server";
import Execution from "./Execution";
import Log from "./Log";
import Tools from "./Tools";

const chalk = require("chalk");

export default class Core {
  configuration: Configuration | null;
  execution: Execution;
  server: Server;
  log: Log;

  // True is the server has started
  private hasStarted = false;

  // True if reality is a simulation
  private isSimulated = false;

  constructor() {
    this.hasStarted = false;
  }
  init(): void {
    this.loadConfiguration();
  }

  criticalError(message: string) {
    const lines = message.split("\n");
    lines.forEach((line) => {
      console.log(
        "[" + Tools.getDateTime() + "] " + chalk.red("Critical error: " + line)
      );
    });

    if (this.hasStarted) {
      console.log(
        "[" +
          Tools.getDateTime() +
          "] " +
          chalk.red("Server will stop due to error")
      );
      this.stop();
    } else {
      console.log(
        "[" +
          Tools.getDateTime() +
          "] " +
          chalk.red("Server will not start due to error")
      );
    }
  }

  loadConfiguration(filename: string = ""): void {
    if (this.hasStarted) {
      this.stop();
    }
    if (this.configuration) {
      this.unloadConfiguration();
    }
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
