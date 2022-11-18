import Tools from "./Tools";

export default class LogConsole {
  static criticalError(message: string) {
    const color = "\x1b[31m%s\x1b[0m";

    const lines = message.split("\n");
    lines.forEach((line) => {
      console.log(
        color,
        "[" + Tools.getDateTime() + "] Critical error: " + line
      );
    });

    console.log(
      color,
      "[" + Tools.getDateTime() + "] Server will not start due to error"
    );
  }

  static criticalLog(message: string) {
    const color = "\x1b[37m%s\x1b[0m";

    const lines = message.split("\n");
    lines.forEach((line) => {
      console.log(color, "[" + Tools.getDateTime() + "] " + line);
    });
  }
}
