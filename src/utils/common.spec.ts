/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { ensureQuoted, sanitizeInput } from './common.js';

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

  describe('sanitizeInput', () => {
    test('should throw an error for non-string input', () => {
      expect(() => sanitizeInput(123 as unknown as string)).toThrow(
        'Invalid input type'
      );
    });

    test('should return the input if it is a string and does not contain disallowed patterns', () => {
      const validInput = 'valid-input';
      expect(sanitizeInput(validInput)).toEqual(validInput);
    });

    it.each([
      ['./../../bad/actor', /\.\./g],
      ['some\rinput', /[\r\n]/g],
      ['some\ninput', /[\r\n]/g],
      ['some;extra', /[;&|]/g],
      ['some; | extra', /[;&|]/g],
      ['some `changes not allowed`', /`/g],
      ['some $extra', /\$/g]
    ])(
      'should throw an error if the input %s contains disallowed patterns %s',
      (input) =>
        expect(() => sanitizeInput(input)).toThrow(
          `Security risk detected in input: ${input}`
        )
    );
  });
});
