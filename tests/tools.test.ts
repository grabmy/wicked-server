import LogSystem from '../src/classes/LogSystem';
import Tools from '../src/classes/Tools';

describe('Tools', () => {
  describe('Date and time', () => {
    test('Get current date and time', async () => {
      const dateTime = Tools.getDateTime();
      const current = new Date().toISOString().replace('T', ' ').replace('Z', ' ').trim().split('.')[0];
      expect(dateTime.length).toBe(19);
      expect(dateTime).toBe(current);
    });

    test('Get specific date and time', async () => {
      const time = 1669626086519; //
      const specific = '2022-11-28 09:01:26';
      const dateTime = Tools.getDateTime(time);
      const current = new Date().toISOString().replace('T', ' ').replace('Z', ' ').trim().split('.')[0];
      expect(dateTime.length).toBe(19);
      expect(dateTime).not.toBe(current);
      expect(dateTime).toBe(specific);
    });

    test('Get current date, time and ms', async () => {
      const dateTime = Tools.getDateTimeMs();
      const current = new Date().toISOString().replace('T', ' ').replace('Z', ' ').trim();
      expect(dateTime.length).toBe(23);
      expect(dateTime).toBe(current);
    });

    test('Get specific date, time and ms', async () => {
      const time = 1669626086519; //
      const specific = '2022-11-28 09:01:26.000';
      const dateTime = Tools.getDateTime(time) + '.' + specific.split('.')[1];
      const current =
        new Date().toISOString().replace('T', ' ').replace('Z', ' ').trim() + '.' + dateTime.split('.')[1];
      expect(dateTime.length).toBe(23);
      expect(dateTime).not.toBe(current);
      expect(dateTime).toBe(specific);
    });
  });

  describe('Delay', () => {
    test('Wait 2 seconds', async () => {
      const startDateTime = new Date().getTime();
      await Tools.delay(2000);
      const endDateTime = new Date().getTime();
      expect(startDateTime).toBeLessThan(endDateTime);
      expect(endDateTime / 1000).toBeCloseTo(startDateTime / 1000 + 2, 1);
    });

    test('Wait for port', async () => {
      const startDateTime = new Date().getTime();
      let available = await Tools.waitForPort(8001, 1000);
      expect(available).toBe(true);
      available = await Tools.waitForPort(8001, 2000);
      expect(available).toBe(true);
      available = await Tools.waitForPort(8001);
      expect(available).toBe(true);
      const endDateTime = new Date().getTime();
      expect(startDateTime / 10000).toBeCloseTo(endDateTime / 10000, 0);
    });
  });

  describe('File', () => {
    beforeEach(() => {
      try {
        require('fs').unlinkSync('tests/tools_file/test.test');
      } catch (e) {}
      try {
        require('fs').unlinkSync('tests/tools_file/copy.test');
      } catch (e) {}
      LogSystem.reset();
      LogSystem.isSilent = true;
    });

    afterEach(() => {
      try {
        require('fs').unlinkSync('tests/tools_file/test.test');
      } catch (e) {}
      try {
        require('fs').unlinkSync('tests/tools_file/copy.test');
      } catch (e) {}
      LogSystem.reset();
      LogSystem.isSilent = true;
    });

    test('File exists on existing file', async () => {
      const exists = Tools.fileExists('tests/tools_file/exists.json');
      expect(exists).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('File exists on non-existing file', async () => {
      const exists = Tools.fileExists('tests/tools_file/i-do-not-exist.null');
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('File exists on non-existing directory', async () => {
      const exists = Tools.fileExists('i/do/not/exist/null/');
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('File exists on existing directory', async () => {
      const exists = Tools.fileExists('tests/tools_file/');
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('File copy success', async () => {
      const from = 'tests/tools_file/exists.json';
      const to = 'tests/tools_file/copy.test';
      const success = Tools.fileCopy(from, to);
      const exists = Tools.fileExists(to);

      expect(success).toBe(true);
      expect(exists).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('File copy on non-existing source', async () => {
      const from = 'i/do/not/exist.md';
      const to = 'tests/tools_file/test.test';
      const success = Tools.fileCopy(from, to);
      const exists = Tools.fileExists(to);

      expect(success).toBe(false);
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(1);
      expect(LogSystem.hasError).toBe(true);
    });

    test('File copy to non-existing directory', async () => {
      const from = 'tests/tools_file/exists.json';
      const to = 'i/do/not/exist/test.test';
      const success = Tools.fileCopy(from, to);
      const exists = Tools.fileExists(to);

      expect(success).toBe(false);
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(1);
      expect(LogSystem.hasError).toBe(true);
    });

    test('File read success', async () => {
      const path = 'tests/tools_file/exists.json';
      const content = Tools.fileRead(path);
      expect(content).not.toBe(false);
      expect(content.trim().startsWith('{')).toBe(true);
      expect(content.trim().endsWith('}')).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('File read on non-existing file', async () => {
      const path = 'i-do-not-exist.json';
      const content = Tools.fileRead(path);
      expect(content).toBe(false);
      expect(LogSystem.output.length).toBe(1);
      expect(LogSystem.hasError).toBe(true);
    });

    test('File read JSON', async () => {
      const path = 'tests/tools_file/exists.json';
      const obj = Tools.fileReadJson(path);
      expect(obj).not.toBe(false);
      expect(obj.name).not.toBeNull();
      expect(obj.name.trim()).not.toBe('');
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Write and delete file', async () => {
      const path = 'tests/tools_file/test.test';
      const content = 'test';

      const writeSuccess = Tools.fileWrite(path, content);
      expect(writeSuccess).toBe(true);
      expect(Tools.fileExists(path)).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);

      const deleteSuccess = Tools.fileDelete(path);
      expect(deleteSuccess).toBe(true);
      expect(Tools.fileExists(path)).toBe(false);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });
  });

  describe('Directory', () => {
    beforeEach(() => {
      try {
        require('fs').rmSync('tests/tools_dir/test/', { recursive: true });
      } catch (e) {}
      LogSystem.reset();
      LogSystem.isSilent = true;
    });

    afterEach(() => {
      try {
        require('fs').rmSync('tests/tools_dir/test/', { recursive: true });
      } catch (e) {}
      LogSystem.reset();
      LogSystem.isSilent = true;
    });

    test('Directory exists on existing directory', async () => {
      const exists = Tools.dirExists('tests/tools_dir/');
      expect(exists).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory exists on absolute path directory', async () => {
      const exists = Tools.dirExists(require('path').resolve('tests/tools_dir/'));
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(1);
      expect(LogSystem.hasError).toBe(true);
    });

    test('Directory exists on absolute path file', async () => {
      const exists = Tools.dirExists(require('path').resolve('tests/tools_dir/exists.json'));
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(1);
      expect(LogSystem.hasError).toBe(true);
    });

    test('Directory exists on existing file', async () => {
      const exists = Tools.dirExists('tests/tools_dir/exists.json');
      expect(exists).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory exists on non-existing directory', async () => {
      const exists = Tools.dirExists('tests/tools_dir/i-do-not-exist/');
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory exists on non-existing file', async () => {
      const exists = Tools.dirExists('tests/tools_dir/i-do-not-exist.null');
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Get directory', async () => {
      const dirExists = Tools.getDir('tests/tools_dir/i-do-not-exist.null');
      expect(dirExists).toBe('tests' + require('path').sep + 'tools_dir' + require('path').sep);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);

      const dirNotExists = Tools.getDir('i/do/not/exist.null');
      expect(dirNotExists).toBe(['i', 'do', 'not'].join(require('path').sep) + require('path').sep);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);

      const dirNoEndSep = Tools.getDir('tests');
      expect(dirNoEndSep).toBe('.' + require('path').sep);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory create without ending sep', async () => {
      let exists = Tools.dirExists('tests/tools_dir/test');
      expect(exists).toBe(false);
      const dirCreate = Tools.dirCreate('tests/tools_dir/test');
      expect(dirCreate).toBe(true);
      exists = Tools.dirExists('tests/tools_dir/test');
      expect(exists).toBe(false);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory create with ending sep', async () => {
      let exists = Tools.dirExists('tests/tools_dir/test/');
      expect(exists).toBe(false);
      const dirCreate = Tools.dirCreate('tests/tools_dir/test/');
      expect(dirCreate).toBe(true);
      exists = Tools.dirExists('tests/tools_dir/test/');
      expect(exists).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory create with file', async () => {
      let exists = Tools.dirExists('tests/tools_dir/test/');
      expect(exists).toBe(false);
      const dirMultipleCreateFile = Tools.dirCreateAll('tests/tools_dir/test/i/do/not/exist.null');
      expect(dirMultipleCreateFile).toBe(true);
      exists = Tools.dirExists('tests/tools_dir/test/i/do/not/');
      expect(exists).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory create multiple', async () => {
      let exists = Tools.dirExists('tests/tools_dir/test/');
      expect(exists).toBe(false);
      const dirMultipleCreate = Tools.dirCreateAll('tests/tools_dir/test/create/multiple/dir/');
      expect(dirMultipleCreate).toBe(true);
      exists = Tools.dirExists('tests/tools_dir/test/create/multiple/dir/');
      expect(exists).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory relative to inside directory', async () => {
      const insideDir = 'tests/tools_dir/test/create/multiple/dir/';
      const rootDir = 'tests/tools_dir/';
      const inside = Tools.dirRelativeTo(insideDir, rootDir);
      expect(inside).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory relative to outside directory', async () => {
      const outsideDir = 'tests/tools_dir/empty/';
      const rootDir = 'other_dir/';
      const outside = Tools.dirRelativeTo(outsideDir, rootDir);
      expect(outside).toBe(false);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Directory relative to back directory', async () => {
      const backDir = 'tests/../../';
      const rootDir = 'tests/';
      const back = Tools.dirRelativeTo(backDir, rootDir);
      expect(back).toBe(false);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Path validation', async () => {
      const normalDir = 'tests/';
      const normal = Tools.pathValidation(normalDir);
      expect(normal).toBe(true);
      expect(LogSystem.output.length).toBe(0);
      expect(LogSystem.hasError).toBe(false);
    });

    test('Path validation on root directory', async () => {
      const rootDir = '/tests/';
      const root = Tools.pathValidation(rootDir);
      expect(root).toBe(false);
      expect(LogSystem.output.length).toBe(1);
      expect(LogSystem.hasError).toBe(true);
    });

    test('Path validation on absolute directory', async () => {
      const absoluteDir = require('path').resolve('tests/tools_dir/');
      const absolute = Tools.pathValidation(absoluteDir);
      expect(absolute).toBe(false);
      expect(LogSystem.output.length).toBe(1);
      expect(LogSystem.hasError).toBe(true);
    });
  });

  describe('Execution', () => {
    test('Command success', async () => {
      const result = await Tools.execute('ls');
      expect(result.stdout).not.toBe('');
      expect(result.stderr).toBe('');
      expect(result.error).toBe(null);
    });
    test('Command error', async () => {
      const result = await Tools.execute('unknown_internal_or_external_command');
      expect(result.stdout).toBe('');
      expect(result.stderr).not.toBe('');
      expect(result.error).not.toBe(null);
    });
  });
});
