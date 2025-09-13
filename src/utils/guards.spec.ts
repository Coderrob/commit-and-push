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

import { isError, isString, isTrue } from './guards';

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

  describe('isTrue', () => {
    it.each([
      [true, true],
      [false, false],
      ['hello', false],
      [123, false],
      [null, false],
      [undefined, false],
      [{}, false],
      [[], false]
    ])('given %s should return %s', (input, expected) =>
      expect(isTrue(input)).toBe(expected)
    );
  });
});
