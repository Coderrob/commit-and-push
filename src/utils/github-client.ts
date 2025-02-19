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

import * as http from '@actions/http-client';

import { GitHubParams } from '../types.js';

const USER_AGENT = 'github-action';
const DEFAULT_TITLE = 'Automated Pull Request';
const DEFAULT_BODY = 'Automated pull request created by GitHub Action.';

/**
 * A client for interacting with the GitHub API.
 */
export class GitHubClient {
  private readonly httpClient: http.HttpClient;
  private readonly params: GitHubParams;

  constructor(params: GitHubParams) {
    this.params = params;
    this.httpClient = new http.HttpClient(USER_AGENT);
  }

  /**
   * Create a new pull request.
   * @param fromBranch The name of the branch to merge.
   * @param toBranch The name of the branch to merge into.
   * @param title - The title of the pull request.
   */
  async createPullRequest(
    fromBranch: string,
    toBranch: string,
    title = DEFAULT_TITLE,
    body = DEFAULT_BODY
  ): Promise<void> {
    const { baseUrl, owner, repo, token } = this.params;
    const url = [baseUrl, 'repos', owner, repo, 'pulls'].join('/');
    this.httpClient.postJson(
      url,
      JSON.stringify({
        head: fromBranch,
        base: toBranch,
        title,
        body
      }),
      {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    );
  }
}

/*
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/pulls \
  -d '{"title":"Amazing new feature","body":"Please pull these awesome changes in!","head":"octocat:new-feature","base":"master"}'
*/
