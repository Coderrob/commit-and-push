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

import { Action } from './action';
import { Input } from './types';

describe('Action', () => {
  let infoSpy: jest.SpyInstance;

  let setFailedSpy: jest.SpyInstance;

  const mockInputs: Record<Input, string> = {
    [Input.AUTHOR_EMAIL]: 'jedi@example.com',
    [Input.AUTHOR_NAME]: 'Captain Picard',
    [Input.BRANCH]: 'test',
    [Input.COMMIT_MESSAGE]: 'You shall not pass!',
    [Input.CREATE_BRANCH]: 'true',
    [Input.DIRECTORY_PATH]: './path/to/mordor',
    [Input.FETCH_LATEST]: 'true',
    [Input.FORCE_PUSH]: 'true',
    [Input.GITHUB_HOSTNAME]: 'github.com',
    [Input.GITHUB_TOKEN]: 'my-precious',
    [Input.OPEN_PULL_REQUEST]: 'false',
    [Input.PULL_REQUEST_BODY]: '',
    [Input.PULL_REQUEST_TITLE]: 'Custom PR title',
    [Input.REMOTE_REF]: 'origin',
    [Input.REPOSITORY]: 'org/repo',
    [Input.SIGN_COMMIT]: 'true'
  };

  beforeEach(() => {
    infoSpy = jest.spyOn(core, 'info').mockImplementation();
    setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error for invalid repository format', () => {
      const invalidInputs = { ...mockInputs, [Input.REPOSITORY]: 'invalid' };
      expect(() => new Action(invalidInputs)).toThrow(
        'Invalid repository format. Expected format: owner/repo'
      );
    });

    it('should throw error for repository without slash', () => {
      const invalidInputs = { ...mockInputs, [Input.REPOSITORY]: 'ownerrepo' };
      expect(() => new Action(invalidInputs)).toThrow(
        'Invalid repository format. Expected format: owner/repo'
      );
    });

    it('should throw error for repository with empty parts', () => {
      const invalidInputs = { ...mockInputs, [Input.REPOSITORY]: 'owner/' };
      expect(() => new Action(invalidInputs)).toThrow(
        'Invalid repository format. Expected format: owner/repo'
      );
    });
  });

  describe('execute', () => {
    let action: Action;
    let updateConfigSpy: jest.SpyInstance;
    let fetchLatestSpy: jest.SpyInstance;
    let checkoutBranchSpy: jest.SpyInstance;
    let stageChangesSpy: jest.SpyInstance;
    let commitChangesSpy: jest.SpyInstance;
    let pushChangesSpy: jest.SpyInstance;

    beforeEach(() => {
      action = new Action(mockInputs);
      updateConfigSpy = jest.spyOn(action['git'], 'updateConfig');
      fetchLatestSpy = jest.spyOn(action['git'], 'fetchLatest');
      checkoutBranchSpy = jest.spyOn(action['git'], 'checkoutBranch');
      stageChangesSpy = jest.spyOn(action['git'], 'stageChanges');
      commitChangesSpy = jest.spyOn(action['git'], 'commitChanges');
      pushChangesSpy = jest.spyOn(action['git'], 'pushChanges');
    });

    it('should execute all steps', async () => {
      updateConfigSpy.mockReturnValue(Promise.resolve(0));
      fetchLatestSpy.mockReturnValue(Promise.resolve(0));
      checkoutBranchSpy.mockReturnValue(Promise.resolve(0));
      stageChangesSpy.mockReturnValue(Promise.resolve(0));
      commitChangesSpy.mockReturnValue(Promise.resolve(0));
      pushChangesSpy.mockReturnValue(Promise.resolve(0));

      await action.execute();

      expect(infoSpy).toHaveBeenCalledTimes(6);
      expect(infoSpy).toHaveBeenNthCalledWith(1, 'Updating config...');
      expect(infoSpy).toHaveBeenNthCalledWith(2, 'Fetching latest...');
      expect(infoSpy).toHaveBeenNthCalledWith(3, 'Checking out branch...');
      expect(infoSpy).toHaveBeenNthCalledWith(4, 'Staging changes...');
      expect(infoSpy).toHaveBeenNthCalledWith(5, 'Committing changes...');
      expect(infoSpy).toHaveBeenNthCalledWith(6, 'Pushing changes...');
      expect(setFailedSpy).not.toHaveBeenCalled();
      expect(updateConfigSpy).toHaveBeenCalledTimes(1);
      expect(updateConfigSpy).toHaveBeenNthCalledWith(
        1,
        'Captain Picard',
        'jedi@example.com',
        true
      );
      expect(fetchLatestSpy).toHaveBeenCalledTimes(1);
      expect(fetchLatestSpy).toHaveBeenNthCalledWith(1);
      expect(checkoutBranchSpy).toHaveBeenCalledTimes(1);
      expect(checkoutBranchSpy).toHaveBeenNthCalledWith(1, 'test', true);
      expect(stageChangesSpy).toHaveBeenCalledTimes(1);
      expect(stageChangesSpy).toHaveBeenNthCalledWith(1, './path/to/mordor');
      expect(commitChangesSpy).toHaveBeenCalledTimes(1);
      expect(commitChangesSpy).toHaveBeenNthCalledWith(
        1,
        'You shall not pass!',
        true
      );
      expect(pushChangesSpy).toHaveBeenCalledTimes(1);
      expect(pushChangesSpy).toHaveBeenNthCalledWith(1, 'origin', 'test', true);
    });

    it('should skip push when no changes to commit', async () => {
      updateConfigSpy.mockReturnValue(Promise.resolve(0));
      fetchLatestSpy.mockReturnValue(Promise.resolve(0));
      checkoutBranchSpy.mockReturnValue(Promise.resolve(0));
      stageChangesSpy.mockReturnValue(Promise.resolve(0));
      commitChangesSpy.mockReturnValue(Promise.resolve(1)); // No changes
      pushChangesSpy.mockReturnValue(Promise.resolve(0));

      await action.execute();

      expect(infoSpy).toHaveBeenCalledWith(
        'No changes to commit. Skipping push and pull request.'
      );
      expect(pushChangesSpy).not.toHaveBeenCalled();
      expect(setFailedSpy).not.toHaveBeenCalled();
    });

    it('should throw error when commit fails', async () => {
      updateConfigSpy.mockReturnValue(Promise.resolve(0));
      fetchLatestSpy.mockReturnValue(Promise.resolve(0));
      checkoutBranchSpy.mockReturnValue(Promise.resolve(0));
      stageChangesSpy.mockReturnValue(Promise.resolve(0));
      commitChangesSpy.mockReturnValue(Promise.resolve(2)); // Error

      await action.execute();

      expect(setFailedSpy).toHaveBeenCalledWith(
        'Action failed: Commit failed. Please check your commit message format and ensure GPG is set up if commit signing is enabled.. Please review the logs for more details.'
      );
    });
  });
});
