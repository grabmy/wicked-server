import Tools from './Tools';

export default class Script {
  private _core: any;
  private _request: any;
  private _response: any;
  private _body: string = '';
  private _charset = '';
  private _contentType = '';
  private _isAsync = false;
  private _isFinished = false;
  private _resolve = (value: boolean): void => {
    return;
  };

  constructor(core: any, request: any, response: any, scriptFct: any) {
    this._core = core;
    this._request = request;
    this._response = response;
    this._body = '';
    this._isAsync = Tools.isAsync(scriptFct);
  }

  get request(): any {
    return this._request;
  }

  get response(): any {
    return this._response;
  }

  get core(): any {
    return this._core;
  }

  get body(): any {
    return this._body;
  }

  get isAsync(): boolean {
    return this._isAsync;
  }

  get isFinished(): boolean {
    return this._isFinished;
  }

  async(async: boolean): void {
    this._isAsync = async;
  }

  resolve(): void {
    this._resolve(true);
    if (this._isFinished == true) {
      return;
    }
    this._isFinished = true;
    if (this.isAsync) {
      this._response.send(this._body);
    }
  }

  resolveAndSend(): void {
    if (this._isFinished == true) {
      return;
    }
    this._isFinished = true;
    this.send();
    this._resolve(true);
  }

  send(): void {
    try {
      this._response.send(this._body);
    } catch (error) {}
  }

  setBody(body: string): Script {
    this._body = body;
    return this;
  }

  setHeader(headerName: string, headerValue: string): Script {
    this._response.header(headerName, headerValue);
    return this;
  }

  setHeaders(options: any): Script {
    Object.entries(options).map((name) => {
      if (name) {
        this.setHeader(name + '', options[name + '']);
      }
    });
    return this;
  }

  setContentType(contentType: string) {
    this._contentType = contentType;
    this.response.setHeader('Content-Type', this._contentType + (this._charset ? '; charset=' + this._charset : ''));
    return this;
  }

  setCharset(charset: string) {
    this._charset = charset;
    this.response.setHeader('Content-Type', this._contentType + (this._charset ? '; charset=' + this._charset : ''));
    return this;
  }

  setStatusCode(code: number): Script {
    this._response.statusCode = code;
    return this;
  }

  promise(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isAsync) {
        this._resolve = resolve;
        if (this._isFinished) {
          this.resolve();
          this.send();
          resolve(true);
        }
      } else {
        this.resolve();
        this.send();
        resolve(true);
      }
    });
  }
}
