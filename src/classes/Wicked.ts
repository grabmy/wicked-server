import Core from "./Core";
import LogConsole from "./LogConsole";

export default class Wicked {
  core: Core;

  private configurtionFile: string = "wicked.config.json";
  private testMode: boolean = false;
  private creationMode: boolean = false;

  private version = "0.1";

  constructor(args: Array<string> = []) {
    LogConsole.criticalLog("wicked server v" + this.version);
    LogConsole.criticalLog("-------------------------");

    if (args.length > 0) {
      this.parseCommandLine(args);
    } else {
      const newArgs = process.argv.splice(0, 2);
      this.parseCommandLine(newArgs);
    }
    this.create();
  }

  parseCommandLine(args: Array<string>): void {
    for (let index = 0; index < process.argv.length; index++) {
      if (process.argv[index].startsWith("--")) {
        this.option(process.argv[index]);
      } else {
        this.option(process.argv[index], process.argv[index + 1]);
        index++;
      }
    }
  }

  option(command: string, value: string = ""): void {
    switch (command) {
      case "-c":
        this.configurtionFile = value;
        break;
      case "--test":
        this.testMode = true;
        break;
      case "--creation":
        this.creationMode = true;
        break;
      case "--help":
        LogConsole.criticalLog("options:");
        LogConsole.criticalLog(
          "-c <path>    : path of the JSON configuration file"
        );
        LogConsole.criticalLog("--help       : show help");
        process.exit();
      default:
        LogConsole.criticalError(
          "Unknown option: " + command + (value ? " " + value : "")
        );
        process.exitCode = 1;
        process.exit();
    }
  }

  create(): void {
    this.core = new Core(this.configurtionFile);
  }

  start(): void {
    this.core.start();
  }

  stop(): void {
    this.core.stop();
  }
}
