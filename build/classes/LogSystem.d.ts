export default class LogSystem {
    static output: Array<string>;
    static noColors: boolean;
    static noDateTime: boolean;
    static hasCriticalError: boolean;
    static hasError: boolean;
    static isSilent: boolean;
    static reset(): void;
    static getColor(type?: string): "" | "\u001B[31m%s\u001B[0m" | "\u001B[33m%s\u001B[0m" | "\u001B[36m%s\u001B[0m" | "\u001B[35m%s\u001B[0m" | "\u001B[32m%s\u001B[0m" | "\u001B[37m%s\u001B[0m";
    static getDateTime(): string;
    static log(message: string, type?: string): void;
}
