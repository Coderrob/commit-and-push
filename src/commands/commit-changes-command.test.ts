import { CommitChangesCommand } from './commit-changes-command';
import * as core from '@actions/core';

import type { IGit } from '../types';

jest.mock('@actions/core', () => ({
  info: jest.fn()
}));

describe('CommitChangesCommand', () => {
  let gitMock: jest.Mocked<IGit>;

  const createMockGit = (): jest.Mocked<IGit> =>
    ({
      updateConfig: jest.fn().mockResolvedValue(0),
      fetchLatest: jest.fn().mockResolvedValue(0),
      checkoutBranch: jest.fn().mockResolvedValue(0),
      stageChanges: jest.fn().mockResolvedValue(0),
      commitChanges: jest.fn().mockResolvedValue(0),
      pushChanges: jest.fn().mockResolvedValue(0)
    }) as unknown as jest.Mocked<IGit>;

  beforeEach(() => {
    gitMock = createMockGit();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should commit changes successfully when exitCode is 0', async () => {
    gitMock.commitChanges.mockResolvedValueOnce(0);
    const command = new CommitChangesCommand(gitMock, 'test message', true);

    await expect(command.execute()).resolves.toBeUndefined();
    expect(core.info).toHaveBeenCalledWith('Committing changes...');
    expect(gitMock.commitChanges).toHaveBeenCalledWith('test message', true);
  });

  it('should throw NoChangesError when exitCode is 1', async () => {
    gitMock.commitChanges.mockImplementationOnce(async () => 1);
    const command = new CommitChangesCommand(gitMock, 'no changes', false);

    await expect(command.execute()).rejects.toThrow('No changes to commit');
    expect(core.info).toHaveBeenCalledWith('Committing changes...');
    expect(core.info).toHaveBeenCalledWith(
      'No changes to commit. Skipping push and pull request.'
    );
    expect(gitMock.commitChanges).toHaveBeenCalledWith('no changes', false);
  });

  it('should throw Error when exitCode is not 0 or 1', async () => {
    gitMock.commitChanges.mockResolvedValueOnce(2);
    const command = new CommitChangesCommand(gitMock, 'fail commit', false);

    await expect(command.execute()).rejects.toThrow('Commit failed.');
    expect(core.info).toHaveBeenCalledWith('Committing changes...');
    expect(gitMock.commitChanges).toHaveBeenCalledWith('fail commit', false);
  });
});
