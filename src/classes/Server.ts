import express from 'express';
import Core from './Core';
import Configuration from './Configuration';
import LogSystem from './LogSystem';
import Tools from './Tools';
import Script from './Script';
const decache = require('decache');

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

  async beforeRequest(request: any, response: any, next: any): Promise<boolean> {
    let isNodeScript = false;
    const nodeScriptFile = this.configuration.public + request.url;
    if (Tools.getUrlExtension(request.url) == 'node.js') {
      isNodeScript = true;
    }

    response.on('finish', () => {
      this.afterRequest(request, response, next);
    });

    if (isNodeScript && Tools.fileExists(nodeScriptFile)) {
      try {
        await this.execute(nodeScriptFile, request, response);
      } catch (error) {
        this.core.logError?.log(error + '', 'error');
        response.statusCode = 500;
      }
      try {
        response.send('');
      } catch (err) {}
    }
    next();

    return true;
  }

  async execute(nodeScriptFile: string, request: any, response: any): Promise<boolean> {
    if (Tools.fileExists(nodeScriptFile)) {
      const pathAbsolute = require('path').resolve('./' + nodeScriptFile);
      //const requirePathAbsolute = require.resolve(pathAbsolute);
      //const requirePathAbsolute2 = require.resolve('./' + nodeScriptFile);

      console.log(pathAbsolute + ' pathAbsolute = ' + typeof require.cache[pathAbsolute]);
      //console.log(requirePathAbsolute + ' requirePathAbsolute = ' + typeof require.cache[requirePathAbsolute]);
      //console.log(requirePathAbsolute2 + ' requirePathAbsolute2 = ' + typeof require.cache[requirePathAbsolute2]);

      //delete require.cache[pathAbsolute];
      //delete require.cache[requirePathAbsolute];
      //delete require.cache[requirePathAbsolute2];

      //require.cache[pathAbsolute] = undefined;
      //require.cache[requirePathAbsolute] = undefined;
      //require.cache[requirePathAbsolute2] = undefined;

      decache(pathAbsolute);
      //decache(requirePathAbsolute);
      //decache(requirePathAbsolute2);

      console.log(pathAbsolute + ' pathAbsolute = ' + typeof require.cache[pathAbsolute]);
      //console.log(requirePathAbsolute + ' requirePathAbsolute = ' + typeof require.cache[requirePathAbsolute]);
      //console.log(requirePathAbsolute2 + ' requirePathAbsolute2 = ' + typeof require.cache[requirePathAbsolute2]);

      const scriptFct = require(pathAbsolute);

      console.log(pathAbsolute + ' pathAbsolute = ' + typeof require.cache[pathAbsolute]);
      //console.log(requirePathAbsolute + ' requirePathAbsolute = ' + typeof require.cache[requirePathAbsolute]);
      //console.log(requirePathAbsolute2 + ' requirePathAbsolute2 = ' + typeof require.cache[requirePathAbsolute2]);

      console.log('--');
      const scriptInstance = new Script(this, request, response, scriptFct);
      const result = await scriptFct(scriptInstance);
      const promise = await scriptInstance.promise();
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
