import { PullRequestService } from './pull-request-service';
export class GitHubClient {
    pullRequestService;
    constructor(params) {
        this.pullRequestService = new PullRequestService(params);
    }
    async createPullRequest(fromBranch, toBranch, title, body) {
        return this.pullRequestService.createPullRequest(fromBranch, toBranch, title, body);
    }
}
//# sourceMappingURL=github-client.js.map