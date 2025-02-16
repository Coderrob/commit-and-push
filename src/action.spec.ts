import * as core from '@actions/core';
import { Action } from './action.js';
import { execCommand } from './utils/git.js';

jest.mock('./utils/git.js', () => ({
  execCommand: jest.fn()
}));

describe('Action', () => {
  let infoSpy: jest.SpyInstance;
  let setOutputSpy: jest.SpyInstance;
  let setFailedSpy: jest.SpyInstance;
  let execCommandMock: jest.Mock;

  beforeEach(() => {
    execCommandMock = execCommand as jest.Mock;
    infoSpy = jest.spyOn(core, 'info');
    setOutputSpy = jest.spyOn(core, 'setOutput');
    setFailedSpy = jest.spyOn(core, 'setFailed');
  });

  afterEach(jest.clearAllMocks);

  describe('run', () => {
    it('should execute the action and return the result', async () => {
      execCommandMock
        // mock for set git user name
        .mockImplementationOnce(async () => {})
        // mock for set git user email
        .mockImplementationOnce(async () => {})
        // mock for sign commit (when signCommit true)
        .mockImplementationOnce(async () => {})
        // mock for fetch latest
        .mockImplementationOnce(async () => {})
        // mock to checkout branch
        .mockImplementationOnce(async () => {})

        .mockImplementationOnce(async () => {})
        .mockImplementationOnce(async () => {})
        .mockImplementationOnce(async () => {})
        .mockImplementationOnce(async () => {
          return { stdout: 'commit 123456', stderr: '', exitCode: 0 };
        });

      await new Action({
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
      }).execute();
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
      expect(execCommandMock).toHaveBeenNthCalledWith(4, {
        args: ['--all'],
        command: 'fetch'
      });
      expect(execCommandMock).toHaveBeenNthCalledWith(5, {
        args: ['main'],
        command: 'checkout'
      });
      expect(execCommandMock).toHaveBeenNthCalledWith(6, {
        args: ['/path/to/mordor'],
        command: 'add'
      });
      expect(execCommandMock).toHaveBeenNthCalledWith(7, {
        args: ['-S', '-m', 'You shall not pass!'],
        command: 'commit'
      });
      expect(execCommandMock).toHaveBeenNthCalledWith(8, {
        args: ['--force', 'refs/heads/main', 'HEAD:main'],
        command: 'push'
      });
      expect(execCommandMock).toHaveBeenNthCalledWith(9, {
        args: ['HEAD'],
        command: 'rev-parse'
      });
      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(setOutputSpy).toHaveBeenCalledTimes(1);
      expect(setOutputSpy).toHaveBeenNthCalledWith(
        1,
        'commit_hash',
        'commit 123456'
      );
      expect(setFailedSpy).toHaveBeenCalledTimes(0);
    });
  });
});
