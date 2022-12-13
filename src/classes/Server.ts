import express from 'express';
import Core from './Core';
import Configuration from './Configuration';
import LogSystem from './LogSystem';
import Tools from './Tools';
import Script from './Script';

export default class Server {
  core: Core;
  configuration: Configuration;

  app: any = null;
  server: any = null;

  constructor(core: Core, configuration: Configuration) {
    this.beforeRequest = this.beforeRequest.bind(this);
    this.handleRequest = this.handleRequest.bind(this);
    this.afterRequest = this.afterRequest.bind(this);

    this.core = core;
    this.configuration = configuration;

    this.app = express();
    this.app.use(this.beforeRequest);
    this.app.use(express.static(this.configuration?.public));
  }

  getPort(): number {
    return this.configuration?.port || 3000;
  }

  start(): void {
    try {
      this.server = this.app.listen(this.getPort(), () => {
        LogSystem.log(`Start listening on port ` + this.getPort(), 'success');
      });
      this.server.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          LogSystem.log(error + '', 'critical');
          this.core.stop();
        } else {
          this.core.logError?.log(error + '', 'error');
        }
      });
    } catch (error) {
      LogSystem.log(error + '', 'critical');
    }
  }

  beforeRequest(request: any, response: any, next: any): void {
    let isNodeScript = false;
    if (Tools.getUrlExtension(request.url) == 'node.js') {
      isNodeScript = true;
    }

    response.on('finish', () => {
      this.afterRequest(request, response, next);
    });

    if (isNodeScript) {
      let success = false;
      try {
        const nodeScriptFile = this.configuration.public + request.url;
        success = this.execute(nodeScriptFile, request, response);
      } catch (error) {
        this.core.logError?.log(error + '', 'error');
      }
      if (!success) {
        next();
      }
    } else {
      next();
    }
  }

  execute(nodeScriptFile: string, request: any, response: any): boolean {
    if (Tools.fileExists(nodeScriptFile)) {
      try {
        const pathAbsolute = require('path').resolve(nodeScriptFile);
        const scriptFct = require(pathAbsolute);
        const scriptInstance = new Script(this, request, response);
        const result = scriptFct(scriptInstance);
        response.send(scriptInstance.body);
        return true;
        // delete cache so the file is also executed next time
        //require?.cache[pathAbsolute] = null;
      } catch (error) {
        this.core.logError?.log(error + '', 'error');
        return false;
      }
    }
    return false;
  }

  handleRequest(request: any, response: any, next: any): void {
    next();
  }

  afterRequest(request: any, response: any, next: any): void {
    const accessLine = this.getClientIp(request) + ' ' + request.method + ' ' + response.statusCode + ' ' + request.url;
    this.core.logAccess?.log(accessLine);
    next();
  }

  getClientIp(request: any): string {
    return request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  }

  stop(): void {
    // this.server
    this.server.close();
    LogSystem.log('Server stopped', 'success');
  }
}
