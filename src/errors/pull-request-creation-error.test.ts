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

import { PullRequestCreationError } from './pull-request-creation-error';

describe('PullRequestCreationError', () => {
  describe('constructor', () => {
    it.each([
      {
        name: 'should create error with message parameter',
        message: 'Branch not found',
        expectedMessage: 'Pull request creation failed: Branch not found',
        expectedName: 'PullRequestCreationError'
      },
      {
        name: 'should create error without message parameter',
        message: undefined,
        expectedMessage: 'Pull request creation failed',
        expectedName: 'PullRequestCreationError'
      },
      {
        name: 'should create error with empty string message',
        message: '',
        expectedMessage: 'Pull request creation failed',
        expectedName: 'PullRequestCreationError'
      },
      {
        name: 'should create error with detailed message',
        message: 'Repository access denied',
        expectedMessage:
          'Pull request creation failed: Repository access denied',
        expectedName: 'PullRequestCreationError'
      }
    ])('$name', ({ message, expectedMessage, expectedName }) => {
      const error =
        message !== undefined
          ? new PullRequestCreationError(message)
          : new PullRequestCreationError();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(expectedMessage);
      expect(error.name).toBe(expectedName);
    });

    it('should be throwable', () => {
      expect(() => {
        throw new PullRequestCreationError('Validation failed');
      }).toThrow('Pull request creation failed: Validation failed');
    });

    it('should have correct prototype chain', () => {
      const error = new PullRequestCreationError();
      expect(error.name).toBe('PullRequestCreationError');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
