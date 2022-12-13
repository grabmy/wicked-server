export default class Script {
  private _core: any;
  private _request: any;
  private _response: any;
  private _body: string = '';
  private _charset = '';
  private _contentType = '';

  constructor(core: any, request: any, response: any) {
    this._core = core;
    this._request = request;
    this._response = response;
    this._body = '';
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

  run(): void {}

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
}
