import Core from "./Core";

const chalk = require("chalk");
const error = chalk.bold.red;

export class Wicked {
  core: Core;

  constructor() {
    this.create();
  }

  create(): void {
    this.criticalError("I'm not a teapot");
  }

  criticalError(message: string) {
    console.log(error("Critical error: " + message));
  }

  start(): void {
    this.core.start();
  }

  stop(): void {
    this.core.stop();
  }
}
