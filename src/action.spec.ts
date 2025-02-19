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

import { Action } from './action.js';
import { Input } from './types.js';

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
    [Input.REMOTE_REF]: 'origin',
    [Input.REPOSITORY]: 'org/repo',
    [Input.SIGN_COMMIT]: 'true'
  };

  beforeEach(() => {
    infoSpy = jest.spyOn(core, 'info');
    setFailedSpy = jest.spyOn(core, 'setFailed');
  });

  afterEach(jest.clearAllMocks);

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
  });
});
