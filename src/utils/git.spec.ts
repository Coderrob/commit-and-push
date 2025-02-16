import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { GitCommand } from '../types.js';
import { execCommand, sanitizeInput } from './git.js';

describe('git', () => {
  let mockInfo: jest.SpyInstance;
  let getExecOutput: jest.SpyInstance;

  beforeEach(() => {
    getExecOutput = jest.spyOn(exec, 'getExecOutput');
    mockInfo = jest.spyOn(core, 'info');
  });

  afterEach(jest.clearAllMocks);

  describe('sanitizeInput', () => {
    test('should throw an error for non-string input', () => {
      expect(() => sanitizeInput(123 as unknown as string)).toThrow(
        'Invalid input type'
      );
    });

    test('should return the input if it is a string and does not contain disallowed patterns', () => {
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
      expect(result).toBe(0);
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
      expect(result).toEqual(1);
      expect(getExecOutput).toHaveBeenCalledWith('git status');
      expect(mockInfo).toHaveBeenCalledTimes(2);
      expect(mockInfo).toHaveBeenNthCalledWith(1, 'Git output: undefined');
      expect(mockInfo).toHaveBeenNthCalledWith(2, 'Git errors: some output');
    });
  });
});
