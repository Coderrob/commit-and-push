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
      const token = 'abc123';
      const headers = client.getHeaders(token);

      expect(headers).toEqual({
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      });
    });
  });
});
