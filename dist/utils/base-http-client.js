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
import { USER_AGENT } from '../constants';
/**
 * Base HTTP client for GitHub API interactions.
 */
export class BaseHttpClient {
    httpClient;
    constructor() {
        this.httpClient = new http.HttpClient(USER_AGENT);
    }
    /**
     * Get the default headers for GitHub API requests.
     * @param token The GitHub token for authentication.
     * @returns The headers object.
     */
    getDefaultHeaders(token) {
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    }
}
//# sourceMappingURL=base-http-client.js.map