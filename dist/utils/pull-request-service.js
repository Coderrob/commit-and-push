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
import { DEFAULT_BODY, DEFAULT_TITLE } from '../constants';
import { BaseHttpClient } from './base-http-client';
import { Guards } from './guards';
/**
 * Service for handling GitHub pull request operations.
 */
export class PullRequestService extends BaseHttpClient {
    params;
    constructor(params) {
        super();
        this.params = params;
    }
    /**
     * Create a new pull request.
     * @param fromBranch The name of the branch to merge.
     * @param toBranch The name of the branch to merge into.
     * @param title The title of the pull request.
     * @param body The body of the pull request.
     */
    async createPullRequest(fromBranch, toBranch, title = DEFAULT_TITLE, body = DEFAULT_BODY) {
        if (fromBranch === toBranch) {
            core.warning(`Skipping pull request creation: 'fromBranch' (${fromBranch}) and 'toBranch' (${toBranch}) are the same.`);
            return;
        }
        const { baseUrl, owner, repo, token } = this.params;
        const url = [baseUrl, 'repos', owner, repo, 'pulls'].join('/');
        try {
            await this.httpClient.postJson(url, JSON.stringify({
                head: fromBranch,
                base: toBranch,
                title,
                body
            }), this.getDefaultHeaders(token));
            core.info('Pull request created successfully.');
        }
        catch (error) {
            const message = Guards.isError(error) ? error.message : String(error);
            core.error(`Error creating pull request: ${message}`);
            throw new Error(`Pull request creation failed: ${message}`);
        }
    }
}
//# sourceMappingURL=pull-request-service.js.map