import { response } from 'express';
import LogSystem from '../src/classes/LogSystem';
import Tools from '../src/classes/Tools';
import Wicked from '../src/classes/Wicked';
import Configuration from '../src/classes/Configuration';

const originalDir = process.cwd();
let server: Wicked | null;

describe('Run server', () => {
  beforeEach(() => {
    if (server?.isRunning) {
      server.stop();
    }
    process.chdir(originalDir);
  });

  afterEach(() => {
    if (server?.isRunning) {
      server.stop();
    }
    process.chdir(originalDir);
  });

  test('Server in an empty directory', async () => {
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/empty/');
    Tools.fileDelete('./wicked.config.json');
    Tools.dirDelete('./public');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(100);

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
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/simple/');
    Tools.dirDelete('./public');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(true);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(LogSystem.output.join('\n')).toContain('Cannot start server with no public directory created');
    expect(Tools.fileExists('./wicked.config.json')).toBe(true);

    // Clean
    Tools.dirDelete('./public');
    process.chdir(originalDir);
  });

  test('Normal server', async () => {
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/normal/');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(100);

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
    server.stop();
    await Tools.delay(100);

    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(true);

    // Clean
    process.chdir(originalDir);
  });

  test('Mime types', async () => {
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/mime/');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(500);

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
    expect(result.html).toContain('<title>Default</title>');

    // gif
    result = await Tools.get('http://localhost:3000/assets/nyan.gif');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('image/gif');
    expect(result.html).not.toBe('');

    // png
    result = await Tools.get('http://localhost:3000/assets/amongus.png');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('image/png');
    expect(result.html).not.toBe('');

    // jpg
    result = await Tools.get('http://localhost:3000/assets/flower.jpg');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('image/jpeg');
    expect(result.html).not.toBe('');

    // ico
    result = await Tools.get('http://localhost:3000/assets/favicon.ico');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('image/x-icon');
    expect(result.html).not.toBe('');

    // font
    result = await Tools.get('http://localhost:3000/assets/font.woff2');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('font/woff2');
    expect(result.html).not.toBe('');

    // js
    result = await Tools.get('http://localhost:3000/assets/script.js');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('application/javascript');
    expect(result.html).not.toBe('');

    // css
    result = await Tools.get('http://localhost:3000/assets/style.css');
    expect(result.ok).toBe(true);
    expect(result.mimeType).toBe('text/css');
    expect(result.html).not.toBe('');

    // Stop
    server.stop();
    await Tools.delay(100);

    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(true);

    // Clean
    process.chdir(originalDir);
  });

  test('Default pages', async () => {
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/mime/');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(500);

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
    expect(result.html).toContain('<title>Default</title>');

    // default page without slash
    result = await Tools.get('http://localhost:3000');
    expect(result.ok).toBe(true);
    expect(result.html).toContain('<title>Default</title>');

    // assets
    result = await Tools.get('http://localhost:3000/assets');
    expect(result.ok).toBe(false);

    // empty 404 page
    result = await Tools.get('http://localhost:3000/404/page/nowhere.xxx');
    expect(result.ok).toBe(false);
    expect(result.html).toBe('');

    // Stop
    server.stop();
    await Tools.delay(100);

    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(true);

    // Clean
    process.chdir(originalDir);
  });

  test('Log', async () => {
    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/log/');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(500);

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
    expect(Tools.fileExists('log/access.log')).toBe(true);
    console.log(Tools.fileRead('log/access.log'));
    expect(Tools.fileRead('log/access.log')).toContain('200');

    // Stop
    server.stop();
    await Tools.delay(100);

    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(true);

    // Clean
    process.chdir(originalDir);
  });
});
