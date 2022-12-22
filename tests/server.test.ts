import { response } from 'express';
import LogSystem from '../src/classes/LogSystem';
import Tools from '../src/classes/Tools';
import Wicked from '../src/classes/Wicked';
import Configuration from '../src/classes/Configuration';

const originalDir = process.cwd();
let server: Wicked | null;
let serverError: Wicked | null;

describe('Run server', () => {
  beforeEach(async () => {
    if (server?.isRunning) {
      await server.stop();
    }
    if (serverError?.isRunning) {
      serverError.stop();
    }
    process.chdir(originalDir);
    LogSystem.reset();
    await Tools.waitForPort(3000);
  });

  afterEach(async () => {
    if (server?.isRunning) {
      await server.stop();
    }
    if (serverError?.isRunning) {
      serverError.stop();
    }
    process.chdir(originalDir);
    LogSystem.reset();
    await Tools.waitForPort(3000);
  });

  test('Server run in an empty directory', async () => {
    const portAvailable = await Tools.waitForPort(3000);
    expect(portAvailable).toBe(true);

    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/server_empty/');
    Tools.fileDelete('./wicked.config.json');
    Tools.dirDelete('./public');

    // Run
    LogSystem.reset();
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(200);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(true);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(LogSystem.output.join(' ')).toContain('Cannot start server with no configuration loaded');
    expect(Tools.fileExists('./wicked.config.json')).toBe(false);

    // Clean
    Tools.fileDelete('./wicked.config.json');
    Tools.dirDelete('./public');
    process.chdir(originalDir);
  });

  test('Simple server without public directory', async () => {
    const portAvailable = await Tools.waitForPort(3000);
    expect(portAvailable).toBe(true);

    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/server_nopublic/');
    Tools.dirDelete('./public/www');
    Tools.dirDelete('./public');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(200);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    // console.log(LogSystem.output);
    expect(LogSystem.hasCriticalError).toBe(true);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(LogSystem.output.join('\n')).toContain('Cannot start server with no public directory created');
    expect(Tools.fileExists('./wicked.config.json')).toBe(true);

    // Clean
    Tools.dirDelete('./public/www');
    Tools.dirDelete('./public');
    process.chdir(originalDir);
  });

  test('Normal server', async () => {
    const portAvailable = await Tools.waitForPort(3000);
    expect(portAvailable).toBe(true);

    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/server_normal/');
    Tools.fileDelete('log/access.log');
    Tools.fileDelete('log/error.log');
    Tools.fileDelete('log/error.log');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(200);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.core.configuration?.name).toBe('normal');
    expect(server.isRunning).toBe(true);
    expect(server.hasRun).toBe(false);
    expect(Tools.fileExists('./wicked.config.json')).toBe(true);
    expect(Tools.dirExists('./public/')).toBe(true);

    // Stop
    await server.stop();
    await Tools.delay(1000);

    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(true);

    // Clean
    Tools.fileDelete('log/access.log');
    Tools.fileDelete('log/error.log');
    process.chdir(originalDir);
  });

  test('Mime types', async () => {
    const portAvailable = await Tools.waitForPort(3000);
    expect(portAvailable).toBe(true);

    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/server_mime/');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(200);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.core.configuration?.name).toBe('mime');
    expect(server.isRunning).toBe(true);

    let result;

    // root page
    result = await Tools.get('http://localhost:3000/index.html');
    expect(result.ok).toBe(true);
    expect(result.data).toContain('<title>Default</title>');

    // gif
    result = await Tools.get('http://localhost:3000/assets/nyan.gif');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('image/gif');
    expect(result.data).not.toBe('');

    // png
    result = await Tools.get('http://localhost:3000/assets/amongus.png');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('image/png');
    expect(result.data).not.toBe('');

    // jpg
    result = await Tools.get('http://localhost:3000/assets/flower.jpg');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('image/jpeg');
    expect(result.data).not.toBe('');

    // ico
    result = await Tools.get('http://localhost:3000/assets/favicon.ico');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('image/x-icon');
    expect(result.data).not.toBe('');

    // font
    result = await Tools.get('http://localhost:3000/assets/font.woff2');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('font/woff2');
    expect(result.data).not.toBe('');

    // js
    result = await Tools.get('http://localhost:3000/assets/script.js');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('application/javascript');
    expect(result.data).not.toBe('');

    // css
    result = await Tools.get('http://localhost:3000/assets/style.css');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('text/css');
    expect(result.data).not.toBe('');

    // Stop
    await server.stop();
    await Tools.delay(200);

    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(true);

    // Clean
    process.chdir(originalDir);
  });

  test('Default pages', async () => {
    const portAvailable = await Tools.waitForPort(3000);
    expect(portAvailable).toBe(true);

    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/server_mime/');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(200);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.core.configuration?.name).toBe('mime');
    expect(server.isRunning).toBe(true);

    let result;

    // default page
    result = await Tools.get('http://localhost:3000/');
    expect(result.ok).toBe(true);
    expect(result.data).toContain('<title>Default</title>');

    // default page without slash
    result = await Tools.get('http://localhost:3000');
    expect(result.ok).toBe(true);
    expect(result.data).toContain('<title>Default</title>');

    // assets
    result = await Tools.get('http://localhost:3000/assets');
    expect(result.ok).toBe(false);

    // empty 404 page
    result = await Tools.get('http://localhost:3000/404/page/nowhere.xxx');
    expect(result.ok).toBe(false);
    expect(result.data).toContain('Error');

    // Stop
    await server.stop();
    await Tools.delay(200);

    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(true);

    // Clean
    process.chdir(originalDir);
  });

  test('Port already in use', async () => {
    const portAvailable = await Tools.waitForPort(3000);
    expect(portAvailable).toBe(true);

    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/server_normal/');
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(200);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.core.configuration?.name).toBe('normal');
    expect(server.isRunning).toBe(true);

    // server error
    serverError = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(200);
    expect(serverError).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(true);
    expect(LogSystem.hasError).toBe(true);
    expect(serverError.isRunning).toBe(false);

    // Stop
    await server.stop();
    await Tools.delay(200);

    // Clean
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');
    process.chdir(originalDir);
  });
});
