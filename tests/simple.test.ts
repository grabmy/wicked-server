import LogConsole from '../src/classes/LogConsole';
import Tools from '../src/classes/Tools';
import Wicked from '../src/classes/Wicked';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const originalDir = process.cwd();

function backToRootDir(): void {
  process.chdir(originalDir);
}

describe('Simple commands', () => {
  test('Console help', async () => {
    // Run
    const server = new Wicked(['--silent', '--no-exit', '--help']);
    await delay(100);

    // Check
    expect(server).not.toBeNull();
    console.log(LogConsole.output);
    expect(LogConsole.output.length).toBeGreaterThan(6);
    expect(LogConsole.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
  });

  test('Create mode', async () => {
    // Prepare
    process.chdir('./tests/empty/');
    Tools.fileDelete('./wicked.config.json');

    // Run
    const server = new Wicked(['--silent', '--no-exit', '--create']);
    await delay(100);

    // Check
    expect(server).not.toBeNull();
    console.log(LogConsole.output);
    expect(LogConsole.output.length).toBeGreaterThan(6);
    expect(LogConsole.hasCriticalError).toBe(false);
    expect(server.isRunning).toBe(false);
    expect(server.hasRun).toBe(false);
    expect(Tools.fileExists('./wicked.config.json')).toBe(true);

    backToRootDir();
  });
});
