import LogSystem from '../src/classes/LogSystem';
import Tools from '../src/classes/Tools';
import Wicked from '../src/classes/Wicked';
import Configuration from '../src/classes/Configuration';

const originalDir = process.cwd();

describe('Simple commands', () => {
  test('Console help', async () => {
    // Run
    const server = new Wicked(['--silent', '--no-exit', '--help']);
    await Tools.delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(8);
    expect(LogSystem.output[4]).toContain('Help:');
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
  });

  test('Create mode in an empty directory', async () => {
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/empty/');
    Tools.fileDelete('./wicked.config.json');
    Tools.dirDelete('./public');
    Tools.dirDelete('./log');

    // Run
    const server = new Wicked(['--silent', '--no-exit', '--create']);
    await Tools.delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(Tools.fileExists('./wicked.config.json')).toBe(true);

    const newConfiguration: Configuration = Tools.fileReadJson('./wicked.config.json');
    expect(newConfiguration.name).toBe('default');
    expect(Tools.dirExists('./public')).toBe(true);
    expect(Tools.dirExists('./log')).toBe(true);

    // Clean
    Tools.fileDelete('./wicked.config.json');
    Tools.dirDelete('./public');
    Tools.dirDelete('./log');
    process.chdir(originalDir);
  });

  test('Create mode with existing config', async () => {
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/simple/');
    Tools.dirDelete('./public/www/');
    Tools.dirDelete('./public/');
    Tools.dirDelete('./log/access/');
    Tools.dirDelete('./log/error/');
    Tools.dirDelete('./log/');

    // Run
    const server = new Wicked(['--silent', '--no-exit', '--create']);
    await Tools.delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(Tools.fileExists('./wicked.config.json')).toBe(true);

    const newConfiguration: Configuration = Tools.fileReadJson('./wicked.config.json');
    expect(newConfiguration.name).toBe('simple');

    expect(Tools.dirExists('./public/www/')).toBe(true);
    expect(Tools.dirExists('./log/error/')).toBe(true);
    expect(Tools.dirExists('./log/access/')).toBe(true);

    // Clean
    Tools.dirDelete('./public/www/');
    Tools.dirDelete('./public');
    Tools.dirDelete('./log/access/');
    Tools.dirDelete('./log/error/');
    Tools.dirDelete('./log/');
    process.chdir(originalDir);
  });

  test('Create mode with complicated config path', async () => {
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/empty/');
    Tools.fileDelete('./config/simple/test.json');
    Tools.dirDelete('./config/simple/');
    Tools.dirDelete('./config/');
    Tools.dirDelete('./public/');
    Tools.dirDelete('./log/');

    // Run
    const server = new Wicked(['--silent', '--no-exit', '--create', '-config', 'config/simple/test.json']);
    await Tools.delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(Tools.fileExists('./config/simple/test.json')).toBe(true);

    const newConfiguration: Configuration = Tools.fileReadJson('./config/simple/test.json');
    expect(newConfiguration.name).toBe('default');

    expect(Tools.dirExists('./public/')).toBe(true);
    expect(Tools.dirExists('./log/')).toBe(true);

    // Clean
    Tools.fileDelete('./config/simple/test.json');
    Tools.dirDelete('./config/simple/');
    Tools.dirDelete('./config/');
    Tools.dirDelete('./public/');
    Tools.dirDelete('./log/');
    process.chdir(originalDir);
  });
});
