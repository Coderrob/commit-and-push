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

import { DirectoryNotFoundError } from './DirectoryNotFoundError';

describe('DirectoryNotFoundError', () => {
  describe('constructor', () => {
    it.each([
      {
        name: 'should create error with path parameter',
        path: '/some/path',
        expectedMessage: "Directory path '/some/path' does not exist.",
        expectedName: 'DirectoryNotFoundError'
      },
      {
        name: 'should create error without path parameter',
        path: undefined,
        expectedMessage: 'Directory path does not exist.',
        expectedName: 'DirectoryNotFoundError'
      },
      {
        name: 'should create error with empty string path',
        path: '',
        expectedMessage: 'Directory path does not exist.',
        expectedName: 'DirectoryNotFoundError'
      },
      {
        name: 'should create error with relative path',
        path: 'relative/path',
        expectedMessage: "Directory path 'relative/path' does not exist.",
        expectedName: 'DirectoryNotFoundError'
      }
    ])('$name', ({ path, expectedMessage, expectedName }) => {
      const error =
        path !== undefined
          ? new DirectoryNotFoundError(path)
          : new DirectoryNotFoundError();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(expectedMessage);
      expect(error.name).toBe(expectedName);
    });

    it('should be throwable', () => {
      expect(() => {
        throw new DirectoryNotFoundError('/test/path');
      }).toThrow("Directory path '/test/path' does not exist.");
    });

    it('should have correct prototype chain', () => {
      const error = new DirectoryNotFoundError();
      expect(error.name).toBe('DirectoryNotFoundError');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
