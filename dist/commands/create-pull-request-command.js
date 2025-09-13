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
/**
 * Command to create a pull request on GitHub.
 */
export class CreatePullRequestCommand {
    gitHubClient;
    branch;
    constructor(gitHubClient, branch) {
        this.gitHubClient = gitHubClient;
        this.branch = branch;
    }
    /**
     * Executes the command to create a pull request.
     */
    async execute() {
        core.info('Opening pull request...');
        await this.gitHubClient.createPullRequest(this.branch, 'main');
    }
}
//# sourceMappingURL=create-pull-request-command.js.map