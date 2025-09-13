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
 */
import * as core from '@actions/core';
import { CreatePullRequestCommand } from './create-pull-request-command';
jest.mock('@actions/core');
describe('CreatePullRequestCommand', () => {
    let mockGitHubClient;
    let command;
    beforeEach(() => {
        mockGitHubClient = {
            createPullRequest: jest.fn()
        };
        command = new CreatePullRequestCommand(mockGitHubClient, 'feature-branch');
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should create a pull request from feature branch to main', async () => {
        mockGitHubClient.createPullRequest.mockResolvedValueOnce(undefined);
        await command.execute();
        expect(core.info).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenNthCalledWith(1, 'Opening pull request...');
        expect(mockGitHubClient.createPullRequest).toHaveBeenCalledTimes(1);
        expect(mockGitHubClient.createPullRequest).toHaveBeenCalledWith('feature-branch', 'main');
    });
    it('should handle errors when creating pull request', async () => {
        const error = new Error('Failed to create PR');
        mockGitHubClient.createPullRequest.mockRejectedValueOnce(error);
        await expect(command.execute()).rejects.toThrow();
        expect(core.info).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenNthCalledWith(1, 'Opening pull request...');
        expect(mockGitHubClient.createPullRequest).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=create-pull-request-command.test.js.map