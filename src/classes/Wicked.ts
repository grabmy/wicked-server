import Core from "./Core";

export default class Wicked {
  core: Core;

  private configurtionFile: string = "";
  private publicPath: string = "";
  private testMode: boolean = false;
  private creationMode: boolean = false;

  constructor() {
    console.log("Wicked:constructor");
    this.create();
  }

  create(): void {
    this.core = new Core();
    this.core.init();
  }

  start(): void {
    this.core.start();
  }

  stop(): void {
    this.core.stop();
  }
}
