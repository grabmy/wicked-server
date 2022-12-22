import Configuration from './Configuration';
import Server from './Server';
import Log from './Log';
export default class Core {
    configuration: Configuration | null;
    server: Server | null;
    logAccess: Log | null;
    logError: Log | null;
    private configurationFile;
    private rootPath;
    private hasStarted;
    private _isRunning;
    private _hasRun;
    get isRunning(): boolean;
    get hasRun(): boolean;
    constructor(configurationFile: string);
    loadConfiguration(path?: string): void;
    unloadConfiguration(): void;
    start(): void;
    stop(): Promise<any>;
}
