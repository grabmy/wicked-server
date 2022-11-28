import LogConsole from '../src/classes/LogConsole';
import Tools from '../src/classes/Tools';

const originalDir = process.cwd();

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
      const dateTime = Tools.getDateTime(1669626086519);
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
      const dateTime = Tools.getDateTime(1669626086519) + '.' + specific.split('.')[1];
      console.log('specific dateTime ' + dateTime);
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
  });

  describe('File', () => {
    beforeEach(() => {
      try {
        require('fs').unlinkSync('tests/test.test');
      } catch (e) {}
      LogConsole.reset();
      LogConsole.isSilent = true;
    });

    afterAll(() => {
      try {
        require('fs').unlinkSync('tests/test.test');
      } catch (e) {}
    });

    test('File exists on existing file', async () => {
      const exists = Tools.fileExists('package.json');
      expect(exists).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('File exists on non-existing file', async () => {
      const exists = Tools.fileExists('i-do-not-exist.null');
      expect(exists).toBe(false);
      expect(LogConsole.output.length).toBe(1);
      expect(LogConsole.hasError).toBe(true);
    });

    test('File exists on non-existing directory', async () => {
      const exists = Tools.fileExists('i/do/not/exist/null/');
      expect(exists).toBe(false);
      expect(LogConsole.output.length).toBe(1);
      expect(LogConsole.hasError).toBe(true);
    });

    test('File exists on existing directory', async () => {
      const exists = Tools.fileExists('tests/');
      expect(exists).toBe(false);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('File copy success', async () => {
      const from = 'README.md';
      const to = 'tests/test.test';
      const success = Tools.fileCopy(from, to);
      const exists = Tools.fileExists(to);

      expect(success).toBe(true);
      expect(exists).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('File copy on non-existing source', async () => {
      const from = 'i/do/not/exist.md';
      const to = 'tests/test.test';
      const success = Tools.fileCopy(from, to);
      const exists = Tools.fileExists(to);

      expect(success).toBe(false);
      expect(exists).toBe(false);
      expect(LogConsole.output.length).toBe(2);
      expect(LogConsole.hasError).toBe(true);
    });

    test('File copy to non-existing directory', async () => {
      const from = 'README.md';
      const to = 'i/do/not/exist/test.test';
      const success = Tools.fileCopy(from, to);
      const exists = Tools.fileExists(to);

      expect(success).toBe(false);
      expect(exists).toBe(false);
      expect(LogConsole.output.length).toBe(2);
      expect(LogConsole.hasError).toBe(true);
    });

    test('File read success', async () => {
      const path = 'package.json';
      const content = Tools.fileRead(path);
      expect(content).not.toBe(false);
      expect(content.trim().startsWith('{')).toBe(true);
      expect(content.trim().endsWith('}')).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('File read on non-existing file', async () => {
      const path = 'i-do-not-exist.json';
      const content = Tools.fileRead(path);
      expect(content).toBe(false);
      expect(LogConsole.output.length).toBe(1);
      expect(LogConsole.hasError).toBe(true);
    });

    test('File read JSON', async () => {
      const path = 'package.json';
      const obj = Tools.fileReadJson(path);
      expect(obj).not.toBe(false);
      expect(obj.name).not.toBeNull();
      expect(obj.name.trim()).not.toBe('');
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });
  });

  describe('Directory', () => {
    beforeEach(() => {
      try {
        require('fs').unlinkSync('tests/test/');
      } catch (e) {}
      LogConsole.reset();
      LogConsole.isSilent = true;
    });

    afterAll(() => {
      try {
        require('fs').unlinkSync('tests/test/');
      } catch (e) {}
    });

    test('Directory exists on existing directory', async () => {
      const exists = Tools.dirExists('tests/');
      expect(exists).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('Directory exists on absolute path directory', async () => {
      const exists = Tools.dirExists(require('path').resolve('tests/'));
      expect(exists).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('Directory exists on absolute path file', async () => {
      const exists = Tools.dirExists(require('path').resolve('tests/tools.test.ts'));
      expect(exists).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('Directory exists on existing file', async () => {
      const exists = Tools.dirExists('tests/tools.test.ts');
      expect(exists).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('Directory exists on non-existing directory', async () => {
      const exists = Tools.dirExists('i-do-not-exist/');
      expect(exists).toBe(false);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('Directory exists on non-existing file', async () => {
      const exists = Tools.dirExists('tests/i-do-not-exist.null');
      expect(exists).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('Get directory', async () => {
      const dirExists = Tools.getDir('tests/i-do-not-exist.null');
      expect(dirExists).toBe('tests' + require('path').sep);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);

      const dirNotExists = Tools.getDir('i/do/not/exist.null');
      expect(dirNotExists).toBe(['i', 'do', 'not'].join(require('path').sep) + require('path').sep);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);

      const dirNoEndSep = Tools.getDir('tests');
      expect(dirNoEndSep).toBe('.' + require('path').sep);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });

    test('Directory create', async () => {
      const dirCreate = Tools.dirCreate('test2/');
      expect(dirCreate).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);

      const dirMultipleCreate = Tools.dirCreate('test2/create/multiple/dir/');
      expect(dirMultipleCreate).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);

      const dirMultipleCreateFile = Tools.dirCreate('test2/i/do/not/exist.null');
      expect(dirMultipleCreateFile).toBe(true);
      expect(LogConsole.output.length).toBe(0);
      expect(LogConsole.hasError).toBe(false);
    });
  });
});

//   process.chdir(originalDir);
