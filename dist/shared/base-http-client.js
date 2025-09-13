import * as http from '@actions/http-client';
import { USER_AGENT } from './constants';
export class BaseHttpClient {
    httpClient;
    constructor() {
        this.httpClient = new http.HttpClient(USER_AGENT);
    }
    getDefaultHeaders(token) {
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    }
}
//# sourceMappingURL=base-http-client.js.map