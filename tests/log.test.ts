import LogSystem from '../src/classes/LogSystem';
import Tools from '../src/classes/Tools';
import Wicked from '../src/classes/Wicked';

const originalDir = process.cwd();
let server: Wicked | null;

describe('Writing log', () => {
  beforeEach(async () => {
    LogSystem.reset();
    if (server?.isRunning) {
      server.stop();
    }
    process.chdir(originalDir);
    await Tools.waitForPort(3000);
  });

  afterEach(async () => {
    LogSystem.reset();
    if (server?.isRunning) {
      server.stop();
    }
    process.chdir(originalDir);
    await Tools.waitForPort(3000);
  });

  test('Access log', async () => {
    const portAvailable = await Tools.waitForPort(3000);
    expect(portAvailable).toBe(true);

    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/log/');
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');
    LogSystem.reset();

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(200);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.core.configuration?.name).toBe('log');
    expect(server.isRunning).toBe(true);

    let result;

    // default page
    result = await Tools.get('http://localhost:3000/');
    expect(result.ok).toBe(true);
    expect(result.code).toBe(200);
    expect(Tools.fileExists('log/access.log')).toBe(true);
    expect(Tools.fileRead('log/access.log')).toContain('GET 200 /');

    // Error page
    result = await Tools.get('http://localhost:3000/error/404.xxx');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(404);
    expect(Tools.fileRead('log/access.log')).toContain('GET 200 /');
    expect(Tools.fileRead('log/access.log')).toContain('GET 404 /error/404.xxx');

    // Stop
    server.stop();
    await Tools.delay(200);

    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(true);

    // Clean
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');
    process.chdir(originalDir);
  });

  test('Error log', async () => {
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/log/');
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');

    // Run
    LogSystem.reset();
    const portAvailable = await Tools.waitForPort(3000);
    expect(portAvailable).toBe(true);
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(200);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    console.log('log.test.ts:100', LogSystem.output);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.core.configuration?.name).toBe('log');
    expect(server.isRunning).toBe(true);

    let result;

    // Error script
    result = await Tools.get('http://localhost:3000/log.node.js');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
    expect(Tools.fileExists('log/error.log')).toBe(true);
    expect(Tools.fileRead('log/error.log')).toContain("Cannot find module 'nothing'");

    // Stop
    server.stop();
    await Tools.delay(200);

    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(true);

    // Clean
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');
    process.chdir(originalDir);
  });
});
