import * as core from '@actions/core';

import { DEFAULT_BODY, DEFAULT_TITLE } from '../../constants';
import { BaseHttpClient, Guards } from '../../utils';
import { PullRequestCreationError } from '../../errors';

import type { GitHubParams } from '../../types';
export class PullRequestService extends BaseHttpClient {
  private readonly params: GitHubParams;

  constructor(params: GitHubParams) {
    super();
    this.params = params;
  }

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
