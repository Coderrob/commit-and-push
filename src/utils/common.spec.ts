import { ensureQuoted } from './common.js';

describe('Common', () => {
  describe('ensureQuoted', () => {
    it.each([
      ['hello', '"hello"'],
      ['world', '"world"'],
      ['123', '"123"'],
      ['"', '"""'],
      ["'", '"\'"'],
      ['\n', '"\n"'],
      ['\t', '"\t"'],
      ['\\', '"\\"'],
      ['hello world', '"hello world"'],
      ['hello\nworld', '"hello\nworld"']
    ])('should ensure that %s is quoted as %s', (input, expected) =>
      expect(ensureQuoted(input)).toBe(expected)
    );
  });
});
