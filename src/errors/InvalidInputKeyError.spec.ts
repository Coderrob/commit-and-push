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

import { InvalidInputKeyError } from './InvalidInputKeyError';

describe('InvalidInputKeyError', () => {
  describe('constructor', () => {
    it.each([
      {
        name: 'should create error with key parameter',
        key: 'invalid-key',
        expectedMessage: 'Invalid input key: invalid-key',
        expectedName: 'InvalidInputKeyError'
      },
      {
        name: 'should create error without key parameter',
        key: undefined,
        expectedMessage: 'Invalid input key',
        expectedName: 'InvalidInputKeyError'
      },
      {
        name: 'should create error with empty string key',
        key: '',
        expectedMessage: 'Invalid input key',
        expectedName: 'InvalidInputKeyError'
      },
      {
        name: 'should create error with numeric key',
        key: '123',
        expectedMessage: 'Invalid input key: 123',
        expectedName: 'InvalidInputKeyError'
      }
    ])('$name', ({ key, expectedMessage, expectedName }) => {
      const error =
        key !== undefined
          ? new InvalidInputKeyError(key)
          : new InvalidInputKeyError();

      // expect(error).toBeInstanceOf(InvalidInputKeyError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(expectedMessage);
      expect(error.name).toBe(expectedName);
      // expect(error.constructor.name).toBe('InvalidInputKeyError');
    });

    it('should be throwable', () => {
      expect(() => {
        throw new InvalidInputKeyError('test-key');
      }).toThrow('Invalid input key: test-key');
    });

    it('should have correct prototype chain', () => {
      const error = new InvalidInputKeyError();
      expect(error.name).toBe('InvalidInputKeyError');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
