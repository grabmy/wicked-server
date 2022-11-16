import LogConsole from "./LogConsole";
import LogAccess from "./LogAccess";
import LogError from "./LogError";
import LogWarning from "./LogWarning";

export default class Log {
  console: LogConsole;
  access: LogAccess;
  error: LogError;
  warning: LogWarning;
}
