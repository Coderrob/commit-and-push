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

import * as fs from 'fs';

import { Git } from './git';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn()
}));

jest.mock('../vcs/common', () => ({
  ...jest.requireActual('../vcs/common'),
  GitCommandExecutor: {
    execCommand: jest.fn(),
    isExecOutputSuccess: jest.fn(),
    ensureQuoted: jest.fn(),
    sanitizeInput: jest.fn()
  }
}));

describe('Git', () => {
  let git: Git;
  let execCommandSpy: jest.Mock;
  let isExecOutputSuccessSpy: jest.Mock;

  beforeEach(() => {
    const mockedCommon = jest.requireMock('../vcs/common');
    execCommandSpy = mockedCommon.GitCommandExecutor.execCommand as jest.Mock;
    isExecOutputSuccessSpy = mockedCommon.GitCommandExecutor
      .isExecOutputSuccess as jest.Mock;

    // Set up ensureQuoted to return quoted strings
    mockedCommon.GitCommandExecutor.ensureQuoted.mockImplementation(
      (str: string) => `"${str}"`
    );

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    git = new Git();
  });

  afterEach(() => {
    jest.clearAllMocks();
    execCommandSpy.mockReset();
    isExecOutputSuccessSpy.mockReset();
  });

  describe('updateConfig', () => {
    it('should update git config with name, email, and to sign commits', async () => {
      execCommandSpy
        .mockResolvedValueOnce({ exitCode: 0 })
        .mockResolvedValueOnce({ exitCode: 0 })
        .mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await git.updateConfig(
        'Captain Picard',
        'jedi@example.com',
        true
      );
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(3);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['--global', 'user.name', '"Captain Picard"'],
        command: 'config'
      });
      expect(execCommandSpy).toHaveBeenNthCalledWith(2, {
        args: ['--global', 'user.email', '"jedi@example.com"'],
        command: 'config'
      });
      expect(execCommandSpy).toHaveBeenNthCalledWith(3, {
        args: ['--global', 'commit.gpgsign', 'true'],
        command: 'config'
      });
    });

    it('should update git config with name and email', async () => {
      execCommandSpy
        .mockResolvedValueOnce({ exitCode: 0 })
        .mockResolvedValueOnce({ exitCode: 0 })
        .mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await git.updateConfig(
        'Captain Picard',
        'jedi@example.com',
        false
      );
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(2);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['--global', 'user.name', '"Captain Picard"'],
        command: 'config'
      });
      expect(execCommandSpy).toHaveBeenNthCalledWith(2, {
        args: ['--global', 'user.email', '"jedi@example.com"'],
        command: 'config'
      });
    });
  });

  describe('fetchLatest', () => {
    it('should fetch the latest changes from the remote repository', async () => {
      execCommandSpy.mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await git.fetchLatest();
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(1);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['--all'],
        command: 'fetch'
      });
    });
  });

  describe('checkoutBranch', () => {
    it('should checkout a specific branch', async () => {
      execCommandSpy.mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await git.checkoutBranch('main', false);
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(1);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['main'],
        command: 'checkout'
      });
    });

    it('should checkout a new branch', async () => {
      execCommandSpy.mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await git.checkoutBranch('main', true);
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(1);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['-b', 'main'],
        command: 'checkout'
      });
    });
  });

  describe('stageChanges', () => {
    it('should stage changes in the specified directory', async () => {
      execCommandSpy.mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await git.stageChanges('/path/to/mordor');
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(1);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['"/path/to/mordor"'],
        command: 'add'
      });
    });

    it('should throw error if directory does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
      await expect(git.stageChanges('/nonexistent')).rejects.toThrow(
        "Directory path '/nonexistent' does not exist."
      );
      expect(execCommandSpy).not.toHaveBeenCalled();
    });
  });

  describe('commitChanges', () => {
    it('should commit changes with the specified message and sign them if required', async () => {
      execCommandSpy.mockImplementationOnce(() =>
        Promise.resolve({ exitCode: 0 })
      );
      const exitCode = await git.commitChanges('You shall not pass!', true);
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(1);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['-S', '-m', '"You shall not pass!"'],
        command: 'commit'
      });
    });

    it('should commit changes with the specified message', async () => {
      execCommandSpy.mockImplementationOnce(() =>
        Promise.resolve({ exitCode: 0 })
      );
      const exitCode = await git.commitChanges('You shall not pass!');
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(1);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['-m', '"You shall not pass!"'],
        command: 'commit'
      });
    });

    it('should return 1 when no changes to commit', async () => {
      execCommandSpy.mockRejectedValueOnce(
        new Error('nothing to commit, working tree clean')
      );
      const exitCode = await git.commitChanges('No changes message');
      expect(exitCode).toEqual(1);
      expect(execCommandSpy).toHaveBeenCalledTimes(1);
    });

    it('should return 2 when commit fails for other reasons', async () => {
      execCommandSpy.mockRejectedValueOnce(
        new Error('Some other commit error')
      );
      const exitCode = await git.commitChanges('Error message');
      expect(exitCode).toEqual(2);
      expect(execCommandSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('pushChanges', () => {
    it('should push changes to the specified remote and branch with force push', async () => {
      execCommandSpy
        .mockResolvedValueOnce({ exitCode: 0, stdout: '', stderr: '' })
        .mockResolvedValueOnce({
          exitCode: 0,
          stdout: '1234567890',
          stderr: ''
        });
      isExecOutputSuccessSpy
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);
      const exitCode = await git.pushChanges('origin', 'main', true);
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(2);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['origin', 'main', '--force'],
        command: 'push'
      });
      expect(execCommandSpy).toHaveBeenNthCalledWith(2, {
        args: ['HEAD'],
        command: 'rev-parse'
      });
    });

    it('should push changes to the specified remote and branch', async () => {
      execCommandSpy
        .mockResolvedValueOnce({ exitCode: 0, stdout: '', stderr: '' })
        .mockResolvedValueOnce({
          exitCode: 0,
          stdout: '1234567890',
          stderr: ''
        });
      isExecOutputSuccessSpy
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);
      const exitCode = await git.pushChanges('origin', 'main');
      expect(exitCode).toEqual(0);
      expect(execCommandSpy).toHaveBeenCalledTimes(2);
      expect(execCommandSpy).toHaveBeenNthCalledWith(1, {
        args: ['origin', 'main'],
        command: 'push'
      });
      expect(execCommandSpy).toHaveBeenNthCalledWith(2, {
        args: ['HEAD'],
        command: 'rev-parse'
      });
    });
  });
});
