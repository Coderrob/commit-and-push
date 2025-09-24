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
 *
 */

import { BaseHttpClient } from './base-http-client';
import * as http from '@actions/http-client';

jest.mock('@actions/http-client');
jest.mock('../constants', () => ({
  USER_AGENT: 'test-user-agent'
}));

describe('BaseHttpClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    (http.HttpClient as jest.Mock).mockClear();
  });

  it('should instantiate httpClient with USER_AGENT', () => {
    new BaseHttpClient();
    expect(http.HttpClient).toHaveBeenCalledWith('test-user-agent');
  });

  describe('getDefaultHeaders', () => {
    class TestClient extends BaseHttpClient {
      public getHeaders(token: string) {
        return this.getDefaultHeaders(token);
      }
    }

    it('should return correct headers with provided token', () => {
      const client = new TestClient();
      const token = 'fake_test_token_not_real_1234567890abcdef12345678'; // Valid GitHub token format (40+ chars)
      const headers = client.getHeaders(token);

      expect(headers).toEqual({
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      });
    });

    it('should throw error for empty token', () => {
      const client = new TestClient();
      expect(() => client.getHeaders('')).toThrow(
        'GitHub token is required but was not provided'
      );
    });

    it('should throw error for invalid token format', () => {
      const client = new TestClient();
      expect(() => client.getHeaders('invalid-token')).toThrow(
        'GitHub token format appears to be invalid'
      );
    });

    it('should accept various GitHub token formats', () => {
      const client = new TestClient();
      const validTokens = [
        'fake_test_token_personal_access_1234567890abcdef12345678',
        'fake_test_token_oauth_token_1234567890abcdef12345678901',
        'fake_test_token_user_token_1234567890abcdef123456789012',
        'fake_test_token_server_token_1234567890abcdef1234567890',
        'fake_test_token_refresh_token_1234567890abcdef123456789',
        'fake_test_token_github_personal_access_token_1234567890abcdef123456789012345678901234567890123456',
        'fake_test_token_legacy_format_1234567890abcdef12345678' // Legacy format (40+ chars)
      ];

      validTokens.forEach((token) => {
        expect(() => client.getHeaders(token)).not.toThrow();
      });
    });
  });
});
