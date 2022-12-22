import { AxiosResponse, AxiosError } from 'axios';
export default class Tools {
    /*************************************************************
     * Date time
     ************************************************************/
    static getDateTime(time?: number): string;
    static getDateTimeMs(time?: number): string;
    /*************************************************************
     * Delay
     ************************************************************/
    static delay(ms: number): Promise<void>;
    static checkPort(port: number): Promise<boolean>;
    static waitForPort(port: number, timeout?: number): Promise<boolean>;
    /*************************************************************
     * File
     ************************************************************/
    static fileExists(path: string): boolean;
    static fileCopy(source: string, destination: string): boolean;
    static fileDelete(path: string): boolean;
    static fileRead(path: string): any;
    static fileReadJson(path: string): any;
    static fileWrite(path: string, content: string): boolean;
    static pathValidation(path: string): boolean;
    /*************************************************************
     * Directory
     ************************************************************/
    static dirExists(path: string): boolean;
    static dirRelativeTo(path: string, rootPath: string): boolean;
    static dirCreate(path: string): boolean;
    static dirCreateAll(path: string): boolean;
    static dirDelete(path: string, recursive?: boolean): boolean;
    static getDir(path: string): string;
    /*************************************************************
     * Request
     ************************************************************/
    static get(url: string, options?: any): Promise<RequestResponse>;
    static getUrlFilename(url: string): string;
    static getUrlExtension(url: string): string;
    static execute(command: string): Promise<CommandResponse>;
    /*************************************************************
     * Execution
     ************************************************************/
    static isPromise(fct: any): boolean;
    static isAsync(fct: any, fctResult?: any | null): boolean;
}
interface CommandResponse {
    error: any | null;
    stderr: string;
    stdout: string;
}
interface RequestResponse {
    response: AxiosResponse | null;
    error: AxiosError | null;
    ok: boolean;
    code: number;
    data: any;
    mimeType: String;
    charset: String;
    json: Object | null;
}
export {};
