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
import { ensureQuoted, execCommand, sanitizeInput } from './common.js';

describe('Common', () => {
  afterEach(jest.clearAllMocks);

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
    it('should throw an error for non-string input', () => {
      expect(() => sanitizeInput(123 as unknown as string)).toThrow(
        'Invalid input type'
      );
    });

    it('should return the input if it is a string and does not contain disallowed patterns', () => {
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

  describe('executeGitCommand', () => {
    let mockInfo: jest.SpyInstance;
    let getExecOutput: jest.SpyInstance;

    beforeEach(() => {
      getExecOutput = jest.spyOn(exec, 'getExecOutput');
      mockInfo = jest.spyOn(core, 'info');
    });

    it('should throw an error for unauthorized Git command', async () => {
      await expect(() =>
        execCommand({
          command: 'unknown-command' as unknown as GitCommand
        })
      ).rejects.toThrow(`Unauthorized Git command: unknown-command`);
      expect(getExecOutput).toHaveBeenCalledTimes(0);
      expect(mockInfo).toHaveBeenCalledTimes(0);
    });

    it('should throw an error for getExecOutput failure', async () => {
      getExecOutput.mockRejectedValueOnce(new Error('Overdue electric bill'));
      await expect(() =>
        execCommand({ command: GitCommand.PUSH })
      ).rejects.toThrow(`Git command failed: Overdue electric bill`);
      expect(getExecOutput).toHaveBeenCalledTimes(1);
      expect(mockInfo).toHaveBeenCalledTimes(0);
    });

    it('should execute a valid Git command and return the successful exit code', async () => {
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

    it('should return a non-zero failure exit code if the execSync call returns errors', async () => {
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
