import Core from './Core';
import Configuration from './Configuration';
export default class Server {
    core: Core;
    configuration: Configuration;
    app: any;
    server: any;
    constructor(core: Core, configuration: Configuration);
    getPort(): number;
    start(): void;
    beforeRequest(request: any, response: any, next: any): Promise<boolean>;
    execute(nodeScriptFile: string, request: any, response: any): Promise<boolean>;
    handleRequest(request: any, response: any, next: any): void;
    afterRequest(request: any, response: any, next: any): void;
    getClientIp(request: any): string;
    stop(): Promise<any>;
}
