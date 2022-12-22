export default class Configuration {
    private _data;
    constructor(data: any);
    get name(): string;
    get port(): number;
    get public(): string;
    get log(): LogData | undefined;
}
export interface ConfigurationData {
    name: string;
    port: number;
    public: string;
    log?: LogData;
}
interface LogData {
    console?: any;
    error?: any;
    access?: any;
}
export {};
