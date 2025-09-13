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

import { DEFAULT_BODY, DEFAULT_TITLE } from '../../constants';
import { BaseHttpClient } from '../../utils/base-http-client';
import { Guards } from '../../utils/guards';
import { PullRequestCreationError } from '../../errors';

import type { GitHubParams } from '../../types';
export class PullRequestService extends BaseHttpClient {
  private readonly params: GitHubParams;

  constructor(params: GitHubParams) {
    super();
    this.params = params;
  }

  /**
   * Create a pull request on GitHub.
   * @param fromBranch - The name of the branch where your changes are implemented.
   * @param toBranch - The name of the branch you want the changes pulled into. This should be the branch you made the changes against.
   * @param title - The title of the pull request.
   * @param body - The contents of the pull request.
   */
  async createPullRequest(
    fromBranch: string,
    toBranch: string,
    title = DEFAULT_TITLE,
    body = DEFAULT_BODY
  ): Promise<void> {
    if (fromBranch === toBranch) {
      core.warning(
        `Skipping pull request creation: 'fromBranch' (${fromBranch}) and 'toBranch' (${toBranch}) are the same.`
      );
      return;
    }

    const { baseUrl, owner, repo, token } = this.params;
    const url = [baseUrl, 'repos', owner, repo, 'pulls'].join('/');

    try {
      await this.httpClient.postJson(
        url,
        JSON.stringify({ head: fromBranch, base: toBranch, title, body }),
        this.getDefaultHeaders(token)
      );
      core.info('Pull request created successfully.');
    } catch (error) {
      const message = Guards.isError(error) ? error.message : String(error);
      core.error(`Error creating pull request: ${message}`);
      throw new PullRequestCreationError(message);
    }
  }
}
