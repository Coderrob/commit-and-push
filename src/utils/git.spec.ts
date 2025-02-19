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

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { GitCommand } from '../types.js';
import { execCommand } from './common.js';

describe('git', () => {
  let mockInfo: jest.SpyInstance;
  let getExecOutput: jest.SpyInstance;

  beforeEach(() => {
    getExecOutput = jest.spyOn(exec, 'getExecOutput');
    mockInfo = jest.spyOn(core, 'info');
  });

  afterEach(jest.clearAllMocks);

  describe('executeGitCommand', () => {
    test('should throw an error for unauthorized Git command', async () => {
      await expect(() =>
        execCommand({
          command: 'unknown-command' as unknown as GitCommand
        })
      ).rejects.toThrow(`Unauthorized Git command: unknown-command`);
      expect(getExecOutput).toHaveBeenCalledTimes(0);
      expect(mockInfo).toHaveBeenCalledTimes(0);
    });

    test('should throw an error for getExecOutput failure', async () => {
      getExecOutput.mockRejectedValueOnce(new Error('Overdue electric bill'));
      await expect(() =>
        execCommand({ command: GitCommand.PUSH })
      ).rejects.toThrow(`Git command failed: Overdue electric bill`);
      expect(getExecOutput).toHaveBeenCalledTimes(1);
      expect(mockInfo).toHaveBeenCalledTimes(0);
    });

    test('should execute a valid Git command and return the successful exit code', async () => {
      getExecOutput.mockResolvedValueOnce({ stdout: 'some output' });
      const result = await execCommand({
        command: GitCommand.STATUS,
        args: []
      });
      expect(result).toEqual({
        exitCode: undefined,
        stderr: undefined,
        stdout: 'some output'
      });
      expect(getExecOutput).toHaveBeenCalledWith('git status');
      expect(mockInfo).toHaveBeenCalledTimes(2);
      expect(mockInfo).toHaveBeenNthCalledWith(1, 'Git output: some output');
      expect(mockInfo).toHaveBeenNthCalledWith(2, 'Git errors: undefined');
    });

    test('should return a non-zero failure exit code if the execSync call returns errors', async () => {
      getExecOutput.mockResolvedValueOnce({ stderr: 'some output' });
      const result = await execCommand({
        command: GitCommand.STATUS,
        args: []
      });
      expect(result).toEqual({
        exitCode: undefined,
        stderr: 'some output',
        stdout: undefined
      });
      expect(getExecOutput).toHaveBeenCalledWith('git status');
      expect(mockInfo).toHaveBeenCalledTimes(2);
      expect(mockInfo).toHaveBeenNthCalledWith(1, 'Git output: undefined');
      expect(mockInfo).toHaveBeenNthCalledWith(2, 'Git errors: some output');
    });
  });
});
