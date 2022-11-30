export default class Configuration {
  private _data!: ConfigurationData;

  constructor(data: any) {
    this._data = initConfigurationData(data);
  }

  get name(): string {
    return this._data.name;
  }

  get port(): number {
    return this._data.port;
  }

  get public(): string {
    return this._data.public;
  }

  get log(): LogData | undefined {
    return this._data.log;
  }
}

export interface ConfigurationData {
  name: string;
  port: number;
  public: string;
  log?: LogData;
}

function initConfigurationData(options?: Partial<ConfigurationData>): ConfigurationData {
  const defaults = {
    name: '',
    port: 3000,
    public: 'public/',
    log: initLog(),
  };

  return {
    ...defaults,
    ...options,
  };
}

interface LogData {
  console?: any;
  error?: any;
  access?: any;
}

function initLog(options?: Partial<LogData>): LogData {
  const defaults = {
    console: {},
    error: {},
    access: {},
  };

  return {
    ...defaults,
    ...options,
  };
}
