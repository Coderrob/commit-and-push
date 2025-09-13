import * as core from '@actions/core';
import { DEFAULT_BODY, DEFAULT_TITLE } from '../../constants';
import { BaseHttpClient, Guards } from '../../utils';
export class PullRequestService extends BaseHttpClient {
    params;
    constructor(params) {
        super();
        this.params = params;
    }
    async createPullRequest(fromBranch, toBranch, title = DEFAULT_TITLE, body = DEFAULT_BODY) {
        if (fromBranch === toBranch) {
            core.warning(`Skipping pull request creation: 'fromBranch' (${fromBranch}) and 'toBranch' (${toBranch}) are the same.`);
            return;
        }
        const { baseUrl, owner, repo, token } = this.params;
        const url = [baseUrl, 'repos', owner, repo, 'pulls'].join('/');
        try {
            await this.httpClient.postJson(url, JSON.stringify({ head: fromBranch, base: toBranch, title, body }), this.getDefaultHeaders(token));
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