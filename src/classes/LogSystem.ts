import Tools from './Tools';

export default class LogSystem {
  public static output: Array<string> = [];
  public static noColors: boolean = false;
  public static noDateTime: boolean = false;
  public static hasCriticalError: boolean = false;
  public static hasError: boolean = false;
  public static isSilent: boolean = false;

  static reset(): void {
    LogSystem.output = [];
    LogSystem.noColors = false;
    LogSystem.noDateTime = false;
    LogSystem.hasCriticalError = false;
    LogSystem.hasError = false;
    LogSystem.isSilent = false;
  }

  static getColor(type: string = '') {
    if (LogSystem.noColors) {
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
    if (LogSystem.noDateTime) {
      return '';
    }
    return '[' + Tools.getDateTime() + ']';
  }

  static log(message: string, type: string = 'regular') {
    const lines = message.split('\n');
    lines.forEach((line) => {
      const finalMessage = (LogSystem.getDateTime() != '' ? LogSystem.getDateTime() + '\t' : '') + type + '\t' + line;
      if (!LogSystem.isSilent) {
        const consoleMessage = (LogSystem.getDateTime() != '' ? LogSystem.getDateTime() + '\t' : '') + line;
        console.log(LogSystem.getColor(type), consoleMessage);
      }
      LogSystem.output.push(finalMessage);
    });

    if (type == 'critical') {
      LogSystem.hasError = true;
      LogSystem.hasCriticalError = true;
    } else if (type == 'error') {
      LogSystem.hasError = true;
    }
  }
}
