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

import { UnauthorizedCommandError } from './unauthorized-command-error';

describe('UnauthorizedCommandError', () => {
  describe('constructor', () => {
    it.each([
      {
        name: 'should create error with command parameter',
        command: 'rm -rf /',
        expectedMessage: 'Unauthorized Git command: rm -rf /',
        expectedName: 'UnauthorizedCommandError'
      },
      {
        name: 'should create error without command parameter',
        command: undefined,
        expectedMessage: 'Unauthorized Git command',
        expectedName: 'UnauthorizedCommandError'
      },
      {
        name: 'should create error with empty string command',
        command: '',
        expectedMessage: 'Unauthorized Git command',
        expectedName: 'UnauthorizedCommandError'
      },
      {
        name: 'should create error with git command',
        command: 'git push --force',
        expectedMessage: 'Unauthorized Git command: git push --force',
        expectedName: 'UnauthorizedCommandError'
      }
    ])('$name', ({ command, expectedMessage, expectedName }) => {
      const error =
        command !== undefined
          ? new UnauthorizedCommandError(command)
          : new UnauthorizedCommandError();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(expectedMessage);
      expect(error.name).toBe(expectedName);
    });

    it('should be throwable', () => {
      expect(() => {
        throw new UnauthorizedCommandError('sudo git');
      }).toThrow('Unauthorized Git command: sudo git');
    });

    it('should have correct prototype chain', () => {
      const error = new UnauthorizedCommandError();
      expect(error.name).toBe('UnauthorizedCommandError');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
