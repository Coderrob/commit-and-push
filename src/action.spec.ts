import * as core from '@actions/core';
import { Action } from './action.js';
import { execCommand, isExecOutputSuccess } from './utils/git.js';
import { Input } from './types.js';

jest.mock('./utils/git.js', () => ({
  execCommand: jest.fn(),
  isExecOutputSuccess: jest.fn()
}));

describe('Action', () => {
  let infoSpy: jest.SpyInstance;
  let setOutputSpy: jest.SpyInstance;
  let setFailedSpy: jest.SpyInstance;
  let execCommandMock: jest.Mock;
  let isExecOutputSuccessMock: jest.Mock;

  const mockInputs: Record<Input, string> = {
    author_email: 'jedi@example.com',
    author_name: 'Captain Picard',
    commit_message: 'You shall not pass!',
    directory_path: '/path/to/mordor',
    force_push: 'true', // push it, push it real good <3 S&P
    github_hostname: 'github.com',
    github_token: 'my-precious',
    remote_ref: 'refs/heads/main',
    sign_commit: 'true', // interpreter's fingers going to be sore from base 64
    target_branch: 'main' // target branch for the commit
  };

  beforeEach(() => {
    execCommandMock = execCommand as jest.Mock;
    isExecOutputSuccessMock = isExecOutputSuccess as jest.Mock;
    infoSpy = jest.spyOn(core, 'info');
    setOutputSpy = jest.spyOn(core, 'setOutput');
    setFailedSpy = jest.spyOn(core, 'setFailed');
  });

  afterEach(jest.clearAllMocks);

  describe('updateConfig', () => {
    it('should update git config with provided inputs and return 0 if successful', async () => {
      execCommandMock
        .mockResolvedValueOnce({ exitCode: 0 })
        .mockResolvedValueOnce({ exitCode: 0 })
        .mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await new Action(mockInputs).updateConfig();
      expect(exitCode).toEqual(0);
      expect(execCommandMock).toHaveBeenCalledTimes(3);
      expect(execCommandMock).toHaveBeenNthCalledWith(1, {
        args: ['--global', 'user.name', 'Captain Picard'],
        command: 'config'
      });
      expect(execCommandMock).toHaveBeenNthCalledWith(2, {
        args: ['--global', 'user.email', 'jedi@example.com'],
        command: 'config'
      });
      expect(execCommandMock).toHaveBeenNthCalledWith(3, {
        args: ['--global', 'commit.gpgsign', 'true'],
        command: 'config'
      });
    });
  });

  describe('fetchLatest', () => {
    it('should fetch the latest changes from the remote repository', async () => {
      execCommandMock.mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await new Action(mockInputs).fetchLatest();
      expect(exitCode).toEqual(0);
      expect(execCommandMock).toHaveBeenCalledTimes(1);
      expect(execCommandMock).toHaveBeenNthCalledWith(1, {
        args: ['--all'],
        command: 'fetch'
      });
    });
  });

  describe('checkoutBranch', () => {
    it('should checkout a specific branch', async () => {
      execCommandMock.mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await new Action(mockInputs).checkoutBranch();
      expect(exitCode).toEqual(0);
      expect(execCommandMock).toHaveBeenCalledTimes(1);
      expect(execCommandMock).toHaveBeenNthCalledWith(1, {
        args: ['main'],
        command: 'checkout'
      });
    });
  });

  describe('stageChanges', () => {
    it('should checkout a specific branch', async () => {
      execCommandMock.mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await new Action(mockInputs).stageChanges();
      expect(exitCode).toEqual(0);
      expect(execCommandMock).toHaveBeenCalledTimes(1);
      expect(execCommandMock).toHaveBeenNthCalledWith(1, {
        args: ['/path/to/mordor'],
        command: 'add'
      });
    });
  });

  describe('commitChanges', () => {
    it('should checkout a specific branch', async () => {
      execCommandMock.mockResolvedValueOnce({ exitCode: 0 });
      const exitCode = await new Action(mockInputs).commitChanges();
      expect(exitCode).toEqual(0);
      expect(execCommandMock).toHaveBeenCalledTimes(1);
      expect(execCommandMock).toHaveBeenNthCalledWith(1, {
        args: ['-S', '-m', 'You shall not pass!'],
        command: 'commit'
      });
    });
  });

  describe('pushChanges', () => {
    it('should checkout a specific branch', async () => {
      execCommandMock
        .mockResolvedValueOnce({ exitCode: 0 })
        .mockResolvedValueOnce({ exitCode: 0, stdout: '1234567890' });
      isExecOutputSuccessMock
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);
      const exitCode = await new Action(mockInputs).pushChanges();
      expect(exitCode).toEqual(0);
      expect(execCommandMock).toHaveBeenCalledTimes(2);
      expect(execCommandMock).toHaveBeenNthCalledWith(1, {
        args: ['--force', 'refs/heads/main', 'HEAD:main'],
        command: 'push'
      });
      expect(execCommandMock).toHaveBeenNthCalledWith(2, {
        args: ['HEAD'],
        command: 'rev-parse'
      });
      expect(infoSpy).toHaveBeenCalledTimes(0);
      expect(setOutputSpy).toHaveBeenCalledTimes(1);
      expect(setOutputSpy).toHaveBeenNthCalledWith(
        1,
        'commit_hash',
        '1234567890'
      );
    });
  });

  describe('execute', () => {
    it('should execute the action and return the result', async () => {
      const action = new Action(mockInputs);

      jest.spyOn(action, 'updateConfig').mockReturnValue(Promise.resolve(0));
      jest.spyOn(action, 'fetchLatest').mockReturnValue(Promise.resolve(0));
      jest.spyOn(action, 'checkoutBranch').mockReturnValue(Promise.resolve(0));
      jest.spyOn(action, 'stageChanges').mockReturnValue(Promise.resolve(0));
      jest.spyOn(action, 'commitChanges').mockReturnValue(Promise.resolve(0));
      jest.spyOn(action, 'pushChanges').mockReturnValue(Promise.resolve(0));

      await action.execute();

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenNthCalledWith(
        1,
        'Changes pushed successfully!'
      );
      expect(setFailedSpy).not.toHaveBeenCalled();
    });
  });
});
