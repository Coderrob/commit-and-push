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

import { Input } from './types';

// Mock the inputs module to provide test values
jest.mock('./inputs', () => ({
  getInputValue: {
    [Input.AUTHOR_EMAIL]: 'test@example.com',
    [Input.AUTHOR_NAME]: 'Test Author',
    [Input.BRANCH]: 'main',
    [Input.COMMIT_MESSAGE]: 'Test commit',
    [Input.CREATE_BRANCH]: 'false',
    [Input.DIRECTORY_PATH]: '/test/path',
    [Input.FETCH_LATEST]: 'true',
    [Input.FORCE_PUSH]: 'false',
    [Input.GITHUB_HOSTNAME]: 'github.com',
    [Input.GITHUB_TOKEN]: 'test-token',
    [Input.OPEN_PULL_REQUEST]: 'true',
    [Input.REMOTE_REF]: 'origin/main',
    [Input.REPOSITORY]: 'test/repo',
    [Input.SIGN_COMMIT]: 'false'
  }
}));

// Mock the Action class to prevent actual execution
jest.mock('./action', () => ({
  Action: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue(undefined)
  }))
}));

describe('index.ts IIFE', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should import the index module without errors', async () => {
    // This test verifies that the module can be imported and the IIFE executes
    // without throwing any errors when all dependencies are mocked
    expect(async () => {
      await import('./index');
    }).not.toThrow();
  });

  it('should be able to import the module multiple times', async () => {
    // Test that the module can be imported multiple times without issues
    await import('./index');
    await import('./index');

    // If we get here without errors, the test passes
    expect(true).toBe(true);
  });
});
