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

  async beforeRequest(request: any, response: any, next: any): Promise<void> {
    let isNodeScript = false;
    if (Tools.getUrlExtension(request.url) == 'node.js') {
      console.log('beforeRequest: isNodeScript');
      isNodeScript = true;
    }

    response.on('finish', () => {
      this.afterRequest(request, response, next);
    });

    if (isNodeScript) {
      let stop = false;
      try {
        const nodeScriptFile = this.configuration.public + request.url;
        console.log('beforeRequest: execute script ' + request.url);
        stop = await this.execute(nodeScriptFile, request, response);
        console.log('beforeRequest: executed ' + request.url + ', stop = ' + stop);
      } catch (error) {
        console.log(error + '');
        this.core.logError?.log(error + '', 'error');
        response.statusCode = 500;
        try {
          response.send('');
        } catch (err) {}
        stop = true;
      }
      if (!stop) {
        next();
      }
    } else {
      next();
    }
  }

  async execute(nodeScriptFile: string, request: any, response: any): Promise<boolean> {
    if (Tools.fileExists(nodeScriptFile)) {
      const pathAbsolute = require('path').resolve(nodeScriptFile);
      const scriptFct = require(pathAbsolute);
      const scriptInstance = new Script(this, request, response);
      const result = await scriptFct(scriptInstance);

      if (!scriptInstance.isFinished) {
        console.log('execute: isFinished = false');
        console.log('execute: resolveAndSend');
        scriptInstance.resolveAndSend();
      } else {
        console.log('execute: isFinished = true');
      }
      const promise = await scriptInstance.promise();
      console.log('execute: promise complete');
      console.log(promise);
      return promise;
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

  async stop(): Promise<any> {
    // this.server
    await this.server.close();
    LogSystem.log('Server stopped', 'success');
  }
}
