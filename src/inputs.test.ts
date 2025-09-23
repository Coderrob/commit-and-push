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

import { getInputValue } from './inputs';
import { Input } from './types';
import * as core from '@actions/core';

// Mock @actions/core
jest.mock('@actions/core', () => ({
  getInput: jest.fn()
}));

describe('Input Proxy Handler (src/inputs.ts)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInputValue Proxy', () => {
    it.each([
      {
        name: 'should return value for AUTHOR_EMAIL',
        inputKey: Input.AUTHOR_EMAIL,
        mockValue: 'test@example.com',
        expected: 'test@example.com'
      },
      {
        name: 'should return value for AUTHOR_NAME',
        inputKey: Input.AUTHOR_NAME,
        mockValue: 'Test Author',
        expected: 'Test Author'
      },
      {
        name: 'should return value for BRANCH',
        inputKey: Input.BRANCH,
        mockValue: 'main',
        expected: 'main'
      },
      {
        name: 'should return value for COMMIT_MESSAGE',
        inputKey: Input.COMMIT_MESSAGE,
        mockValue: 'Test commit',
        expected: 'Test commit'
      },
      {
        name: 'should return value for CREATE_BRANCH',
        inputKey: Input.CREATE_BRANCH,
        mockValue: 'true',
        expected: 'true'
      },
      {
        name: 'should return value for DIRECTORY_PATH',
        inputKey: Input.DIRECTORY_PATH,
        mockValue: '/test/path',
        expected: '/test/path'
      },
      {
        name: 'should return value for FETCH_LATEST',
        inputKey: Input.FETCH_LATEST,
        mockValue: 'false',
        expected: 'false'
      },
      {
        name: 'should return value for FORCE_PUSH',
        inputKey: Input.FORCE_PUSH,
        mockValue: 'true',
        expected: 'true'
      },
      {
        name: 'should return value for GITHUB_HOSTNAME',
        inputKey: Input.GITHUB_HOSTNAME,
        mockValue: 'github.com',
        expected: 'github.com'
      },
      {
        name: 'should return value for GITHUB_TOKEN',
        inputKey: Input.GITHUB_TOKEN,
        mockValue: 'token123',
        expected: 'token123'
      },
      {
        name: 'should return value for OPEN_PULL_REQUEST',
        inputKey: Input.OPEN_PULL_REQUEST,
        mockValue: 'true',
        expected: 'true'
      },
      {
        name: 'should return value for REMOTE_REF',
        inputKey: Input.REMOTE_REF,
        mockValue: 'origin/main',
        expected: 'origin/main'
      },
      {
        name: 'should return value for REPOSITORY',
        inputKey: Input.REPOSITORY,
        mockValue: 'owner/repo',
        expected: 'owner/repo'
      },
      {
        name: 'should return value for SIGN_COMMIT',
        inputKey: Input.SIGN_COMMIT,
        mockValue: 'false',
        expected: 'false'
      },
      {
        name: 'should return default value when getInput returns empty',
        inputKey: Input.CREATE_BRANCH,
        mockValue: '',
        expected: 'false' // default value
      }
    ])('$name', ({ inputKey, mockValue, expected }) => {
      // Mock core.getInput to return the specified value
      (core.getInput as jest.Mock).mockReturnValue(mockValue);

      // Access the proxy
      const result = getInputValue[inputKey];

      // Verify the result
      expect(result).toBe(expected);

      // Verify getInput was called with correct parameters
      expect(core.getInput).toHaveBeenCalledWith(
        expect.any(String), // The input ID
        { required: expect.any(Boolean) } // Required flag
      );
    });

    it.each([
      {
        name: 'should throw InvalidInputKeyError for invalid key',
        invalidKey: 'invalid-key'
      },
      {
        name: 'should throw InvalidInputKeyError for empty key',
        invalidKey: ''
      },
      {
        name: 'should throw InvalidInputKeyError for numeric key',
        invalidKey: '123'
      }
    ])('$name', ({ invalidKey }) => {
      // Attempt to access invalid key
      expect(() => {
        void (getInputValue as unknown as Record<string, unknown>)[invalidKey];
      }).toThrow('Invalid input key');

      // Verify getInput was not called
      expect(core.getInput).not.toHaveBeenCalled();
    });

    it('should validate key before calling getInput', () => {
      const invalidKey = 'invalid-key';

      expect(() => {
        void (getInputValue as unknown as Record<string, unknown>)[invalidKey];
      }).toThrow('Invalid input key');

      // getInput should not be called for invalid keys
      expect(core.getInput).not.toHaveBeenCalled();
    });
  });
});
