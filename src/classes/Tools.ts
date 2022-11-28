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
    try {
      if (require('fs').statSync(path).isDirectory()) {
        return false;
      }
      return require('fs').existsSync(path);
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static fileCopy(source: string, destination: string): boolean {
    try {
      fs.copyFileSync(source, destination);
      return Tools.fileExists(destination);
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static fileDelete(path: string): boolean {
    try {
      fs.unlinkSync(path);
      return true;
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static fileRead(path: string): any {
    try {
      return fs.readFileSync(path).toString();
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  static fileReadJson(path: string): any {
    try {
      return JSON.parse(fs.readFileSync(path));
    } catch (err) {
      LogConsole.log('' + err, 'error');
      return false;
    }
  }

  /*************************************************************
   * Directory
   ************************************************************/

  static dirExists(path: string): boolean {
    const dir = Tools.getDir(path);
    return fs.existsSync(dir);
  }

  static dirCreate(path: string): boolean {
    console.log('dirCreate: path = ' + path);
    const dir = Tools.getDir(path);
    console.log('dirCreate: dir = ' + dir);
    if (!fs.existsSync(dir)) {
      console.log('dirCreate: creating ...');
      fs.mkdirSync(dir);
    }
    console.log('dirCreate: done, ' + fs.existsSync(dir));
    return fs.existsSync(dir);
  }

  static getDir(path: string): string {
    if (path.endsWith('/') || path.endsWith('\\')) {
      return path;
    }
    return require('path').normalize('./' + require('path').dirname(path) + '/');
  }

  /*
  static getAbsoluteDir(path: string): string {
    console.log('getAbsoluteDir: path = ' + path);
    console.log('getAbsoluteDir: resolve path = ' + require('path').resolve(path));
    console.log('getAbsoluteDir: dirname path = ' + require('path').dirname(path));
    return require('path').dirname(require('path').resolve(path));
  }

  static getAbsoluteFile(path: string): string {
    return require('path').resolve(path);
  }
  */
}
