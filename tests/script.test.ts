import { response } from 'express';
import LogSystem from '../src/classes/LogSystem';
import Tools from '../src/classes/Tools';
import Wicked from '../src/classes/Wicked';
import Configuration from '../src/classes/Configuration';

const originalDir = process.cwd();
let server: Wicked | null;

describe('Run node script', () => {
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

  test('Request node script', async () => {
    await Tools.delay(200);

    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/script/');
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');

    // Run
    server = new Wicked(['--silent', '--no-exit']);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(true);
    expect(server.hasRun).toBe(false);

    let result;

    // root page
    result = await Tools.get('http://localhost:3000/script.node.js');
    expect(result.ok).toBe(true);
    expect(result.data).toContain('script.ok');

    // Clean
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');
    Tools.dirDelete('./public');
    process.chdir(originalDir);
  });

  test('Change status code', async () => {
    await Tools.delay(200);

    // Prepare
    process.chdir(originalDir);
    process.chdir('./tests/script/');
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');

    // Run
    server = new Wicked(['--silent', '--no-exit']);
    await Tools.delay(100);

    // Check
    expect(server).not.toBeNull();
    expect(LogSystem.output.length).toBeGreaterThan(6);
    expect(LogSystem.hasCriticalError).toBe(false);
    expect(LogSystem.hasError).toBe(false);
    expect(server.isRunning).toBe(true);
    expect(server.hasRun).toBe(false);

    let result;

    // 200
    result = await Tools.get('http://localhost:3000/script_200.node.js');
    expect(result.ok).toBe(true);
    expect(result.code).toBe(200);
    expect(result.data).toContain('script.status.code');

    // 201
    result = await Tools.get('http://localhost:3000/script_201.node.js');
    expect(result.ok).toBe(true);
    expect(result.code).toBe(201);
    expect(result.data).toContain('script.status.code');

    // 301 => 201
    result = await Tools.get('http://localhost:3000/script_301.node.js');
    expect(result.ok).toBe(true);
    expect(result.code).toBe(201);
    expect(result.data).toContain('script.status.code');

    // 401
    result = await Tools.get('http://localhost:3000/script_401.node.js');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(401);
    expect(result.data).toContain('script.status.code');

    // 404
    result = await Tools.get('http://localhost:3000/script_404.node.js');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(404);
    expect(result.data).toContain('script.status.code');

    // 500
    result = await Tools.get('http://localhost:3000/script_500.node.js');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(500);
    expect(result.data).toContain('script.status.code');

    // No script
    result = await Tools.get('http://localhost:3000/script_do_not_exists.node.js');
    expect(result.ok).toBe(false);
    expect(result.code).toBe(404);
    expect(result.data).toContain('<title>Error</title>');

    // Clean
    Tools.fileDelete('./log/access.log');
    Tools.fileDelete('./log/error.log');
    Tools.dirDelete('./public');
    process.chdir(originalDir);
  });

  // Error in script

  // Long script

  // multiple long script
});

// TODO Add
