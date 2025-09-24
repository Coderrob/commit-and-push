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

import { GitCommandFailedError } from './git-command-failed.error';

describe('GitCommandFailedError', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it.each([
      {
        name: 'should create error with message parameter',
        message: 'git status failed',
        expectedMessage: 'Git command failed: git status failed',
        expectedName: 'GitCommandFailedError'
      },
      {
        name: 'should create error without message parameter',
        message: undefined,
        expectedMessage: 'Git command failed',
        expectedName: 'GitCommandFailedError'
      },
      {
        name: 'should create error with empty string message',
        message: '',
        expectedMessage: 'Git command failed',
        expectedName: 'GitCommandFailedError'
      },
      {
        name: 'should create error with detailed message',
        message: 'fatal: not a git repository',
        expectedMessage: 'Git command failed: fatal: not a git repository',
        expectedName: 'GitCommandFailedError'
      }
    ])('$name', ({ message, expectedMessage, expectedName }) => {
      const error =
        message !== undefined
          ? new GitCommandFailedError(message)
          : new GitCommandFailedError();

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(GitCommandFailedError);
      expect(error.message).toBe(expectedMessage);
      expect(error.name).toBe(expectedName);
    });

    it('should be throwable', () => {
      expect(() => {
        throw new GitCommandFailedError('git push failed');
      }).toThrow('Git command failed: git push failed');
    });

    it('should have correct prototype chain', () => {
      const error = new GitCommandFailedError();
      expect(error.name).toBe('GitCommandFailedError');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(GitCommandFailedError);
    });
  });
});
