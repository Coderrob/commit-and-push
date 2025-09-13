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
import { PullRequestService } from './pull-request-service';
/**
 * A client for interacting with the GitHub API.
 */
export class GitHubClient {
    pullRequestService;
    constructor(params) {
        this.pullRequestService = new PullRequestService(params);
    }
    /**
     * Create a new pull request.
     * @param fromBranch The name of the branch to merge.
     * @param toBranch The name of the branch to merge into.
     * @param title - The title of the pull request.
     */
    async createPullRequest(fromBranch, toBranch, title, body) {
        return this.pullRequestService.createPullRequest(fromBranch, toBranch, title, body);
    }
}
//# sourceMappingURL=github-client.js.map