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
import * as http from '@actions/http-client';

import { GitHubClient } from './github-client';
import { PullRequestService } from './pull-request-service';

import type { GitHubParams } from '../types';
describe('GitHubClient', () => {
  let httpClient: jest.Mocked<http.HttpClient>;
  let warningSpy: jest.SpyInstance;

  const params: GitHubParams = {
    baseUrl: 'https://api.github.com',
    token: 'token',
    owner: 'owner',
    repo: 'repo'
  };

  beforeEach(() => {
    httpClient = {
      postJson: jest.fn()
    } as unknown as jest.Mocked<http.HttpClient>;
    jest.spyOn(http, 'HttpClient').mockImplementation(() => httpClient);
    warningSpy = jest.spyOn(core, 'warning').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPullRequest', () => {
    it('should create a pull request when branches are different', async () => {
      await new GitHubClient(params).createPullRequest('feature', 'main');

      expect(httpClient.postJson).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/pulls',
        JSON.stringify({
          head: 'feature',
          base: 'main',
          title: 'Automated Pull Request',
          body: 'Automated pull request created by GitHub Action.'
        }),
        {
          Authorization: 'Bearer token',
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      );
      expect(warningSpy).not.toHaveBeenCalled();
    });

    it('should skip creating pull request when branches are the same', async () => {
      await new GitHubClient(params).createPullRequest('main', 'main');

      expect(httpClient.postJson).not.toHaveBeenCalled();
      expect(warningSpy).toHaveBeenCalledWith(
        "Skipping pull request creation: 'fromBranch' (main) and 'toBranch' (main) are the same."
      );
    });

    it('should pass title and body to pullRequestService.createPullRequest', async () => {
      const mockCreatePullRequest = jest
        .spyOn(PullRequestService.prototype, 'createPullRequest')
        .mockResolvedValue(undefined);

      const client = new GitHubClient(params);

      await client.createPullRequest(
        'feature',
        'main',
        'Custom Title',
        'Custom Body'
      );

      expect(mockCreatePullRequest).toHaveBeenCalledWith(
        'feature',
        'main',
        'Custom Title',
        'Custom Body'
      );
      mockCreatePullRequest.mockRestore();
    });

    it('should call pullRequestService.createPullRequest with undefined title and body if not provided', async () => {
      const mockCreatePullRequest = jest
        .spyOn(PullRequestService.prototype, 'createPullRequest')
        .mockResolvedValue(undefined);

      const client = new GitHubClient(params);

      await client.createPullRequest('feature', 'main');

      expect(mockCreatePullRequest).toHaveBeenCalledWith(
        'feature',
        'main',
        undefined,
        undefined
      );
      mockCreatePullRequest.mockRestore();
    });

    it('should delegate createPullRequest to PullRequestService with correct arguments', async () => {
      const mockCreatePullRequest = jest
        .spyOn(PullRequestService.prototype, 'createPullRequest')
        .mockResolvedValue(undefined);

      const client = new GitHubClient(params);
      await client.createPullRequest('dev', 'main', 'PR Title', 'PR Body');

      expect(mockCreatePullRequest).toHaveBeenCalledWith(
        'dev',
        'main',
        'PR Title',
        'PR Body'
      );
      mockCreatePullRequest.mockRestore();
    });

    it('should delegate createPullRequest to PullRequestService with undefined title and body', async () => {
      const mockCreatePullRequest = jest
        .spyOn(PullRequestService.prototype, 'createPullRequest')
        .mockResolvedValue(undefined);

      const client = new GitHubClient(params);
      await client.createPullRequest('dev', 'main');

      expect(mockCreatePullRequest).toHaveBeenCalledWith(
        'dev',
        'main',
        undefined,
        undefined
      );
      mockCreatePullRequest.mockRestore();
    });
  });
});
