import type { GitHubParams, IGitHubClient } from '../../types';
import { PullRequestService } from './pull-request-service';

export class GitHubClient implements IGitHubClient {
  private readonly pullRequestService: PullRequestService;

  constructor(params: GitHubParams) {
    this.pullRequestService = new PullRequestService(params);
  }

  async createPullRequest(
    fromBranch: string,
    toBranch: string,
    title?: string,
    body?: string
  ): Promise<void> {
    return this.pullRequestService.createPullRequest(
      fromBranch,
      toBranch,
      title,
      body
    );
  }
}
