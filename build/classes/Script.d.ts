export default class Script {
    private _core;
    private _request;
    private _response;
    private _body;
    private _charset;
    private _contentType;
    private _isAsync;
    private _isFinished;
    private _resolve;
    constructor(core: any, request: any, response: any);
    get request(): any;
    get response(): any;
    get core(): any;
    get body(): any;
    get isAsync(): boolean;
    get isFinished(): boolean;
    async(): void;
    resolve(): void;
    resolveAndSend(): void;
    setBody(body: string): Script;
    setHeader(headerName: string, headerValue: string): Script;
    setHeaders(options: any): Script;
    setContentType(contentType: string): this;
    setCharset(charset: string): this;
    setStatusCode(code: number): Script;
    promise(): Promise<boolean>;
}
