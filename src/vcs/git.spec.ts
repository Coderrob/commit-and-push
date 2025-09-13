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

jest.mock('./common', () => ({
  ...jest.requireActual('./common'),
  GitCommandExecutor: {
    execCommand: jest.fn(),
    isExecOutputSuccess: jest.fn(),
    ensureQuoted: jest.fn(),
    sanitizeInput: jest.fn()
  }
}));

describe('VCS Git (migrated)', () => {
  let git: Git;
  let execCommandSpy: jest.Mock;
  let isExecOutputSuccessSpy: jest.Mock;

  beforeEach(() => {
    const mockedCommon = jest.requireMock('./common');
    execCommandSpy = mockedCommon.GitCommandExecutor.execCommand as jest.Mock;
    isExecOutputSuccessSpy = mockedCommon.GitCommandExecutor
      .isExecOutputSuccess as jest.Mock;

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

  it('should call execCommand for updateConfig', async () => {
    execCommandSpy
      .mockResolvedValueOnce({ exitCode: 0 })
      .mockResolvedValueOnce({ exitCode: 0 })
      .mockResolvedValueOnce({ exitCode: 0 });
    const exitCode = await git.updateConfig('Name', 'email', true);
    expect(exitCode).toEqual(0);
    expect(execCommandSpy).toHaveBeenCalledTimes(3);
  });

  it('should throw when staging non-existent dir', async () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    await expect(git.stageChanges('/no')).rejects.toThrow();
  });

  it('should return failure code when push fails', async () => {
    // Simulate push failing (isExecOutputSuccess false)
    execCommandSpy.mockResolvedValueOnce({
      exitCode: 1,
      stdout: '',
      stderr: 'err'
    });
    isExecOutputSuccessSpy.mockReturnValueOnce(false);
    const result = await git.pushChanges('origin', 'main');
    expect(result).toEqual(1); // core.ExitCode.Failure === 1
    expect(execCommandSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw when unable to get commit hash after push', async () => {
    // Simulate push succeeded then rev-parse failed
    execCommandSpy
      .mockResolvedValueOnce({ exitCode: 0, stdout: '', stderr: '' })
      .mockResolvedValueOnce({
        exitCode: 1,
        stdout: undefined,
        stderr: 'no head'
      });
    isExecOutputSuccessSpy.mockReturnValueOnce(true).mockReturnValueOnce(false);
    await expect(git.pushChanges('origin', 'main')).rejects.toThrow(
      'Failed to get commit hash: no head'
    );
    expect(execCommandSpy).toHaveBeenCalledTimes(2);
  });
});
