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
import * as http from '@actions/http-client';
import { PullRequestService } from './pull-request-service';
jest.mock('@actions/core');
jest.mock('@actions/http-client');
describe('PullRequestService', () => {
    let service;
    let mockHttpClient;
    const mockParams = {
        baseUrl: 'https://api.github.com',
        token: 'mock-token',
        owner: 'test-owner',
        repo: 'test-repo'
    };
    beforeEach(() => {
        mockHttpClient = {
            postJson: jest.fn()
        };
        http.HttpClient.mockImplementation(() => mockHttpClient);
        service = new PullRequestService(mockParams);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('createPullRequest', () => {
        it('should create a pull request successfully', async () => {
            mockHttpClient.postJson.mockResolvedValue({
                statusCode: 201,
                result: {},
                headers: {}
            });
            await service.createPullRequest('feature-branch', 'main', 'Test PR', 'Test body');
            expect(core.info).toHaveBeenCalledWith('Pull request created successfully.');
            expect(mockHttpClient.postJson).toHaveBeenCalledWith('https://api.github.com/repos/test-owner/test-repo/pulls', JSON.stringify({
                head: 'feature-branch',
                base: 'main',
                title: 'Test PR',
                body: 'Test body'
            }), {
                Authorization: 'Bearer mock-token',
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            });
        });
        it('should use default title and body when not provided', async () => {
            mockHttpClient.postJson.mockResolvedValue({
                statusCode: 201,
                result: {},
                headers: {}
            });
            await service.createPullRequest('feature-branch', 'main');
            expect(mockHttpClient.postJson).toHaveBeenCalledWith('https://api.github.com/repos/test-owner/test-repo/pulls', JSON.stringify({
                head: 'feature-branch',
                base: 'main',
                title: 'Automated Pull Request',
                body: 'Automated pull request created by GitHub Action.'
            }), expect.any(Object));
        });
        it('should skip creation when fromBranch equals toBranch', async () => {
            await service.createPullRequest('main', 'main');
            expect(core.warning).toHaveBeenCalledWith("Skipping pull request creation: 'fromBranch' (main) and 'toBranch' (main) are the same.");
            expect(mockHttpClient.postJson).not.toHaveBeenCalled();
        });
        it('should handle API errors', async () => {
            const apiError = new Error('API Error');
            mockHttpClient.postJson.mockRejectedValue(apiError);
            await expect(service.createPullRequest('feature-branch', 'main')).rejects.toThrow('Pull request creation failed: API Error');
            expect(core.error).toHaveBeenCalledWith('Error creating pull request: API Error');
        });
        it('should handle non-Error exceptions', async () => {
            mockHttpClient.postJson.mockRejectedValue('String error');
            await expect(service.createPullRequest('feature-branch', 'main')).rejects.toThrow('Pull request creation failed: String error');
            expect(core.error).toHaveBeenCalledWith('Error creating pull request: String error');
        });
    });
});
//# sourceMappingURL=pull-request-service.spec.js.map