import Tools from './Tools';

export default class LogConsole {
  public static output: Array<string> = [];
  public static noColors: boolean = false;
  public static noDateTime: boolean = false;
  public static hasCriticalError: boolean = false;
  public static hasError: boolean = false;
  public static isSilent: boolean = false;

  static reset(): void {
    LogConsole.output = [];
    LogConsole.noColors = false;
    LogConsole.noDateTime = false;
    LogConsole.hasCriticalError = false;
    LogConsole.hasError = false;
    LogConsole.isSilent = false;
  }

  static getColor(type: string = '') {
    if (LogConsole.noColors) {
      return '';
    }

    switch (type) {
      case 'critical':
      case 'error':
        return '\x1b[31m%s\x1b[0m';
      case 'warning':
        return '\x1b[33m%s\x1b[0m';
      case 'info':
        return '\x1b[36m%s\x1b[0m';
      case 'sexy':
        return '\x1b[35m%s\x1b[0m';
      case 'success':
        return '\x1b[32m%s\x1b[0m';
      default:
        return '\x1b[37m%s\x1b[0m';
    }
  }

  static getDateTime() {
    if (LogConsole.noDateTime) {
      return '';
    }
    return '[' + Tools.getDateTime() + ']';
  }

  static log(message: string, type: string = 'regular') {
    const lines = message.split('\n');
    lines.forEach((line) => {
      const finalMessage = (LogConsole.getDateTime() != '' ? LogConsole.getDateTime() + '\t' : '') + type + '\t' + line;
      if (!LogConsole.isSilent) {
        const consoleMessage = (LogConsole.getDateTime() != '' ? LogConsole.getDateTime() + '\t' : '') + line;
        console.log(LogConsole.getColor(type), consoleMessage);
      }
      LogConsole.output.push(finalMessage);
    });

    if (type == 'critical') {
      LogConsole.hasError = true;
      LogConsole.hasCriticalError = true;
    } else if (type == 'error') {
      LogConsole.hasError = true;
    }
  }
}
