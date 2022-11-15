import Configuration from "./Configuration";
import Server from "./Server";
import Execution from "./Execution";
import Log from "./Log";

export default class Core {
  configuration: Configuration;
  execution: Execution;
  server: Server;
  log: Log;

  loadConfiguration(filename: string = ""): void {
    //
  }

  start(): void {
    //
  }

  stop(): void {
    //
  }
}
