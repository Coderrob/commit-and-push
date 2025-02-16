import { isError, isString } from './guards.js';

describe('guards', () => {
  describe('isString', () => {
    it.each([
      ['hello', true],
      [123, false],
      [null, false],
      [undefined, false],
      [{}, false],
      [[], false]
    ])('given %s should return %s', (input, expected) =>
      expect(isString(input)).toBe(expected)
    );
  });

  describe('isError', () => {
    it('should return true when given an error', () =>
      expect(isError(new Error('hello'))).toBe(true));

    it.each([
      ['hello', false],
      [123, false],
      [null, false],
      [undefined, false],
      [{}, false],
      [[], false]
    ])('given %s should return %s', (input, expected) =>
      expect(isError(input)).toBe(expected)
    );
  });
});
