import express from 'express';
import Core from './Core';
import Configuration from './Configuration';
import LogSystem from './LogSystem';

export default class Server {
  core!: Core | null;
  configuration!: Configuration | null;

  app: any = null;
  server: any = null;

  constructor(core: Core, configuration: Configuration) {
    this.beforeRequest = this.beforeRequest.bind(this);
    this.handleRequest = this.handleRequest.bind(this);
    this.afterRequest = this.afterRequest.bind(this);

    this.core = core;
    this.configuration = configuration;

    this.app = express();
    this.app.use(express.static(this.configuration?.public));
    this.app.use(this.beforeRequest, this.handleRequest, this.afterRequest);
  }

  getPort(): number {
    return this.configuration?.port || 3000;
  }

  start(): void {
    this.server = this.app.listen(this.getPort(), () => {
      LogSystem.log(`Start listening on port ` + this.getPort(), 'success');
    });
  }

  beforeRequest(request: any, response: any, next: any): void {
    console.log('beforeRequest');
    next();
  }

  handleRequest(request: any, response: any, next: any): void {
    console.log('handleRequest');
    next();
  }

  afterRequest(request: any, response: any, next: any): void {
    const accessLine = this.getClientIp(request) + ' ' + request.method + ' ' + response.statusCode + ' ' + request.url;
    //const accessLine = request.method + ' ' + response.statusCode + ' ' + request.url;
    console.log('accessLine = ' + accessLine);
    this.core?.logAccess?.log(accessLine);
    next();
  }

  getClientIp(request: any): string {
    return request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  }

  stop(): void {
    // this.server
    this.server.close();
    LogSystem.log('Server stoped', 'success');
  }
}
