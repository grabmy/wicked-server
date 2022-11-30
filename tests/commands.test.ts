import LogConsole from '../src/classes/LogConsole';
import Tools from '../src/classes/Tools';
import Wicked from '../src/classes/Wicked';
import Configuration from '../src/classes/Configuration';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const originalDir = process.cwd();

describe('Simple commands', () => {
  test('Console help', async () => {
    // Run
    const server = new Wicked(['--silent', '--no-exit', '--help']);
    await delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogConsole.output.length).toBeGreaterThan(8);
    expect(LogConsole.output[4]).toContain('Help:');
    expect(LogConsole.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
  });

  test('Create mode in an empty directory', async () => {
    // Prepare
    process.chdir('./tests/empty/');
    Tools.fileDelete('./wicked.config.json');
    Tools.dirDelete('./public');

    // Run
    const server = new Wicked(['--silent', '--no-exit', '--create']);
    await delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogConsole.output.length).toBeGreaterThan(6);
    expect(LogConsole.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(Tools.fileExists('./wicked.config.json')).toBe(true);

    const newConfiguration: Configuration = Tools.fileReadJson('./wicked.config.json');
    expect(newConfiguration.name).toBe('default');

    expect(Tools.dirExists('./public')).toBe(true);

    // Clean
    Tools.fileDelete('./wicked.config.json');
    Tools.dirDelete('./public');
    process.chdir(originalDir);
  });

  test('Create mode with existing config', async () => {
    // Prepare
    process.chdir('./tests/simple/');
    Tools.dirDelete('./public/www/');
    Tools.dirDelete('./public/');

    // Run
    const server = new Wicked(['--silent', '--no-exit', '--create']);
    await delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogConsole.output.length).toBeGreaterThan(6);
    expect(LogConsole.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(Tools.fileExists('./wicked.config.json')).toBe(true);

    const newConfiguration: Configuration = Tools.fileReadJson('./wicked.config.json');
    expect(newConfiguration.name).toBe('simple');

    expect(Tools.dirExists('./public/www/')).toBe(true);

    // Clean
    Tools.dirDelete('./public/www/');
    Tools.dirDelete('./public');
    process.chdir(originalDir);
  });

  test('Create mode with complicated config path', async () => {
    // Prepare
    process.chdir('./tests/empty/');
    Tools.fileDelete('./config/simple/test.json');
    Tools.dirDelete('./config/simple/');
    Tools.dirDelete('./config/');
    Tools.dirDelete('./public/');

    // Run
    const server = new Wicked(['--silent', '--no-exit', '--create', '-config', 'config/simple/test.json']);
    await delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogConsole.output.length).toBeGreaterThan(6);
    expect(LogConsole.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(Tools.fileExists('./config/simple/test.json')).toBe(true);

    const newConfiguration: Configuration = Tools.fileReadJson('./config/simple/test.json');
    expect(newConfiguration.name).toBe('default');

    expect(Tools.dirExists('./public/')).toBe(true);

    // Clean
    Tools.fileDelete('./config/simple/test.json');
    Tools.dirDelete('./config/simple/');
    Tools.dirDelete('./config/');
    Tools.dirDelete('./public/');
    process.chdir(originalDir);
  });
});
