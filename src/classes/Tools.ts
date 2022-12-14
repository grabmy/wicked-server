import LogSystem from './LogSystem';
import axios, { AxiosResponse, AxiosError } from 'axios';

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

  static async checkPort(port: number): Promise<boolean> {
    const net = require('net');
    const server = net.createServer();

    let remaining = 10000;
    let hasResult = false;
    let result = false;

    server.once('error', function (error: any) {
      if (error.code === 'EADDRINUSE') {
        hasResult = true;
        result = false;
      }
    });

    server.once('listening', function () {
      hasResult = true;
      result = true;
    });

    await server.listen(port);

    while (remaining > 0) {
      remaining -= 100;
      await Tools.delay(100);
      if (hasResult) {
        break;
      }
    }

    await server.close();

    return result;
  }

  static async waitForPort(port: number, timeout: number = 10000): Promise<boolean> {
    let remaining = timeout;
    let result = false;

    while (remaining > 0) {
      remaining -= 100;
      await Tools.delay(100);
      const available = await Tools.checkPort(port);
      if (available) {
        result = true;
        break;
      }
    }
    console.log('waitForPort: result = ' + result);
    return result;
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
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        console.log('fileExists: ' + err);
      }
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
      LogSystem.log('' + err, 'error');
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
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        console.log('fileDelete: code = ' + err.code);
        console.log('fileDelete: ' + err);
      }
      LogSystem.log('' + err, 'error');
      return false;
    }
  }

  static fileRead(path: string): any {
    if (!Tools.pathValidation(path)) {
      return false;
    }
    if (!Tools.fileExists(path)) {
      LogSystem.log('Cannot read non-existing file: ' + path, 'error');
      return false;
    }
    try {
      return fs.readFileSync(path).toString();
    } catch (err) {
      console.log('fileRead: Error: ' + err);
      LogSystem.log('' + err, 'error');
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
      LogSystem.log('' + err, 'error');
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
      LogSystem.log('' + err, 'error');
      return false;
    }
  }

  static pathValidation(path: string): boolean {
    if (require('path').isAbsolute(path)) {
      LogSystem.log('Error: Cannot use absolute path "' + path + '"', 'error');
      return false;
    }
    if (require('path').normalize(path).startsWith(require('path').sep)) {
      LogSystem.log('Error: Cannot use relative path "' + path + '" starting with directory separator', 'error');
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
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    } catch (err) {
      console.log('dirCreate: Error: ' + err);
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
      /*
      fs.readdir(path, (err: any, files: any) => {
        if (err) throw err;
        for (const file of files) {
          require('fs').unlink(require('path').join(path, file), (err: any) => {
            console.log('dirDelete: delete file: ' + err);
          });
        }
      });
      */
      fs.rmdirSync(path, { recursive });
      return true;
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        console.log('dirDelete: ' + err);
      }
      LogSystem.log('' + err, 'error');
      return false;
    }
  }

  static getDir(path: string): string {
    if (path.endsWith('/') || path.endsWith('\\')) {
      return require('path').normalize(path);
    }
    return require('path').normalize('./' + require('path').dirname(path) + '/');
  }

  /*************************************************************
   * Request
   ************************************************************/

  static async get(url: string, options?: any): Promise<RequestResponse> {
    function getContentType(response: AxiosResponse | undefined): string {
      if (!response) {
        return '';
      }
      let contentType = '';
      if (typeof response.headers.getContentType === 'function') {
        contentType = response.headers.getContentType()?.toString() || '';
      } else if (typeof response.headers.getContentType === 'string') {
        contentType = response.headers.getContentType || '';
      }
      return contentType;
    }

    function getMimeType(response: AxiosResponse | undefined): string {
      if (!response) {
        return '';
      }
      const contentType = getContentType(response);
      const parts = contentType.split(';');
      return parts[0];
    }

    function getCharset(response: AxiosResponse | undefined): string {
      if (!response) {
        return '';
      }
      const contentType = getContentType(response);
      const parts = contentType.split(';');
      let charset = '';
      for (let t = 0; t < parts.length; t++) {
        if (parts[t].trim().toLowerCase().startsWith('charset=')) {
          charset = parts[t].replace('charset=', '').trim();
        }
      }
      return charset;
    }

    return await axios({
      ...{
        url,
        method: 'GET',
        timeout: 8000,
      },
      ...options,
    })
      .then(function (response: AxiosResponse) {
        let json: Object | null = null;
        if (response?.data instanceof Object) {
          json = response.data;
        }

        const result: RequestResponse = {
          response,
          error: null,
          ok: true,
          code: response.status || 500,
          mimeType: getMimeType(response),
          charset: getCharset(response),
          data: response.data,
          json: null,
        };
        return result;
      })
      .catch(function (error: AxiosError) {
        const data = error.response?.data;

        let contentType = '';
        if (typeof error.response?.headers.getContentType === 'function') {
          contentType = error.response?.headers.getContentType()?.toString() || '';
        } else if (typeof error.response?.headers.getContentType === 'string') {
          contentType = error.response?.headers.getContentType || '';
        }
        const result: RequestResponse = {
          response: error.response || null,
          error,
          ok: false,
          code: error.response?.status || 500,
          mimeType: getMimeType(error.response),
          charset: getCharset(error.response),
          data,
          json: null,
        };
        return result;
      });
  }

  static getUrlFilename(url: string): string {
    if (url.endsWith('/')) {
      return '';
    }
    const parsed = require('url').parse(url);
    return require('path').basename(parsed.pathname);
  }

  static getUrlExtension(url: string): string {
    const filename = Tools.getUrlFilename(url);
    if (filename == '') {
      return '';
    }
    const parts = filename.split('.');
    if (parts.length <= 0) {
      return '';
    }
    parts.shift();
    return parts.join('.');
  }
}

interface RequestResponse {
  response: AxiosResponse | null;
  error: AxiosError | null;
  ok: boolean;
  code: number;
  data: any;
  mimeType: String;
  charset: String;
  json: Object | null;
}
