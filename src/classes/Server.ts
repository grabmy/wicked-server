import express from 'express';
import Core from './Core';

export default class Server {
  core: Core;
  app: any = null;
  server: any = null;

  constructor(core: Core) {
    this.core = core;

    this.app = express();
  }

  init(): void {
    this.app.get('/', (req: any, res: any) => {
      res.send('Hello World!');
    });
  }

  start(): void {
    this.server = this.app.listen(3000, () => {
      console.log(`Example app listening on port 3000`);
    });
  }

  stop(): void {
    this.server.close();
  }
}
