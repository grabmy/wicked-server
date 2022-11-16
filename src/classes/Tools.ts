export default class Tools {
  static getDateTime(): string {
    return new Date().toISOString().replace("T", " ").replace("Z", " ").trim();
  }
}
