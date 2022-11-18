export default class Tools {
  static getDateTime(): string {
    return new Date().toISOString().replace("T", " ").replace("Z", " ").trim();
  }

  static fileExists(path: string): boolean {
    try {
      return require("fs").existsSync(path);
    } catch (err) {
      return false;
    }
  }

  static fileRead(path: string): any {
    try {
      let rawdata = require("fs").readFileSync(path);
      return JSON.parse(rawdata);
    } catch (err) {
      return false;
    }
  }
}
