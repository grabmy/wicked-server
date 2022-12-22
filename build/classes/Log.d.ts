declare enum LogTarget {
    Console = 0,
    File = 1
}
export default class Log {
    output: Array<string>;
    noColors: boolean;
    noDateTime: boolean;
    hasCriticalError: boolean;
    isSilent: boolean;
    name: string;
    private _target;
    private _file;
    private _enabled;
    private _hasError;
    constructor(name: string, options: any);
    get enabled(): boolean;
    get hasError(): boolean;
    set enabled(enabled: boolean);
    get target(): Array<LogTarget>;
    set target(newTarget: any);
    get file(): string;
    set file(file: string);
    valid(): boolean;
    addTarget(newTarget: string): void;
    reset(): void;
    getColor(type?: string): "" | "\u001B[31m%s\u001B[0m" | "\u001B[33m%s\u001B[0m" | "\u001B[36m%s\u001B[0m" | "\u001B[35m%s\u001B[0m" | "\u001B[32m%s\u001B[0m" | "\u001B[37m%s\u001B[0m";
    getDateTime(): string;
    log(message: string, type?: string): void;
    private send;
}
export {};
