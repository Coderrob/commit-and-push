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
      const token = 'ghp_FAKE1234567890123456789012345678901234TEST'; // Valid GitHub token format
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
        'ghp_FAKE1234567890123456789012345678901234TEST',
        'gho_1234567890123456789012345678901234567890',
        'ghu_1234567890123456789012345678901234567890',
        'ghs_1234567890123456789012345678901234567890',
        'ghr_1234567890123456789012345678901234567890',
        'github_pat_12345678901234567890123456789012345678901234567890123456789',
        '1234567890123456789012345678901234567890' // Legacy format (40+ chars)
      ];

      validTokens.forEach((token) => {
        expect(() => client.getHeaders(token)).not.toThrow();
      });
    });
  });
});
