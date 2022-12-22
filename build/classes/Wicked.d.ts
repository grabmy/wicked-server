import Core from './Core';
export default class Wicked {
    core: Core;
    private _configurationFile;
    private _testMode;
    private _exitOnError;
    private _hasExited;
    private _creationMode;
    private _version;
    private _rootDir;
    get hasRun(): boolean;
    get isRunning(): boolean;
    constructor(args?: Array<string>);
    reset(): void;
    logIntro(): void;
    parseCommandLine(args: Array<string>): void;
    priorityOption(command: string, value?: string): void;
    option(command: string, value?: string): void;
    optionError(command: string, value: string): void;
    commandHelp(): void;
    commandCreation(): void;
    start(): Wicked;
    stop(): Promise<void>;
}
