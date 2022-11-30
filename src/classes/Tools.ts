import LogConsole from './LogConsole';

const fs = require('fs');

export default class Tools {
  /*************************************************************
   * Date time
   ************************************************************/

  static getDateTime(time?: number): string {
    if (time) {
      return new Date(time).toISOString().replace('T', ' ').replace('Z', ' ').trim().split('.')[0];
    }
    return new Date().toISOString().replace('T', ' ').replace('Z', ' ').trim().split('.')[0];
  }

  static getDateTimeMs(time?: number): string {
    if (time) {
      return new Date(time).toISOString().replace('T', ' ').replace('Z', ' ').trim();
    }
    return new Date().toISOString().replace('T', ' ').replace('Z', ' ').trim();
  }

  /*************************************************************
   * Delay
   ************************************************************/

  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /*************************************************************
   * File
   ************************************************************/

  static fileExists(path: string): boolean {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    try {
      if (require('fs').statSync(path).isDirectory()) {
        return false;
      }
      return require('fs').existsSync(path);
    } catch (err) {
      // LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static fileCopy(source: string, destination: string): boolean {
    // No path validation on source
    if (!Tools.pathValidation(destination)) {
      return false;
    }
    try {
      fs.copyFileSync(source, destination);
      return Tools.fileExists(destination);
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static fileDelete(path: string): boolean {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    if (!Tools.fileExists(path)) {
      return true;
    }
    try {
      fs.unlinkSync(path);
      return true;
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static fileRead(path: string): any {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    try {
      return fs.readFileSync(path).toString();
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static fileReadJson(path: string): any {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    try {
      return JSON.parse(fs.readFileSync(path));
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static fileWrite(path: string, content: string): boolean {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    try {
      require('fs').writeFileSync(path, content);
      return true;
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static pathValidation(path: string): boolean {
    if (require('path').isAbsolute(path)) {
      LogConsole.log('Error: Cannot use absolute path "' + path + '"', 'error');
      return false;
    }
    if (require('path').normalize(path).startsWith(require('path').sep)) {
      LogConsole.log('Error: Cannot use relative path "' + path + '" starting with directory separator', 'error');
      return false;
    }
    return true;
  }

  /*************************************************************
   * Directory
   ************************************************************/

  static dirExists(path: string): boolean {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    const dir = Tools.getDir(path + '/');
    return fs.existsSync(dir);
  }

  static dirRelativeTo(path: string, rootPath: string): boolean {
    // No path validation for root path
    if (!Tools.pathValidation(path)) {
      return false;
    }
    const dir = require('path').resolve(Tools.getDir(path));
    const rootDir = require('path').resolve(Tools.getDir(rootPath));
    return dir.startsWith(rootDir);
  }

  static dirCreate(path: string): boolean {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    const dir = Tools.getDir(path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return fs.existsSync(dir);
  }

  static dirCreateAll(path: string): boolean {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    const dirNormalized = require('path').normalize(Tools.getDir(path + '/'));
    const parts = dirNormalized.split(require('path').sep);
    let dir = '';
    parts.forEach((nextDir: string) => {
      dir += nextDir + require('path').sep;
      const success = Tools.dirCreate(dir);
      if (!success) {
        return false;
      }
    });
    return true;
  }

  static dirDelete(path: string, recursive: boolean = false): boolean {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    if (!Tools.dirExists(path)) {
      return true;
    }
    try {
      fs.rmSync(path, { recursive });
      return true;
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static getDir(path: string): string {
    if (path.endsWith('/') || path.endsWith('\\')) {
      return require('path').normalize(path);
    }
    return require('path').normalize('./' + require('path').dirname(path) + '/');
  }
}
