import * as core from '@actions/core';
import { SecureLogger } from './secure-logger';

jest.mock('@actions/core');

describe('SecureLogger', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('redactSensitiveInfo (tested via public methods)', () => {
    it('should redact GitHub personal access tokens', () => {
      const message = 'Token: Bearer test_token_1234567890abcdef';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('Token: Bear...cdef');
    });

    it('should redact Bearer tokens', () => {
      const message = 'Authorization: Bearer FAKE_TOKEN_FOR_TESTING_ONLY';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('Authorization: Bear...ONLY');
    });

    it('should redact passwords', () => {
      const message = 'password: FAKE_PASSWORD_FOR_TESTING';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('pass...TING');
    });

    it('should redact API keys', () => {
      const message = 'api_key: FAKE_API_KEY_FOR_TESTING_PURPOSE_ONLY';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('api_...ONLY');
    });

    it('should not redact very short token strings', () => {
      const message = 'token: abc';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('token: abc');
    });

    it('should not redact non-sensitive content', () => {
      const message = 'This is a normal message';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith(message);
    });
  });

  describe('info', () => {
    it('should call core.info with redacted message', () => {
      const message = 'Info with token: Bearer test_token_1234567890abcdef';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('Info with token: Bear...cdef');
    });
  });

  describe('warning', () => {
    it('should call core.warning with redacted message', () => {
      const message = 'Warning with password: FAKE_PASSWORD_FOR_TESTING';
      SecureLogger.warning(message);
      expect(core.warning).toHaveBeenCalledWith('Warning with pass...TING');
    });
  });

  describe('error', () => {
    it('should call core.error with redacted message', () => {
      const message =
        'Error with api_key: FAKE_API_KEY_FOR_TESTING_PURPOSE_ONLY';
      SecureLogger.error(message);
      expect(core.error).toHaveBeenCalledWith('Error with api_...ONLY');
    });
  });

  describe('debug', () => {
    it('should call core.debug with redacted message', () => {
      const message = 'Debug with Bearer FAKE_TOKEN_FOR_TESTING_ONLY';
      SecureLogger.debug(message);
      expect(core.debug).toHaveBeenCalledWith('Debug with Bear...ONLY');
    });
  });

  describe('logObject', () => {
    it('should log redacted JSON string without label', () => {
      const obj = {
        token: 'Bearer test_token_1234567890abcdef',
        normal: 'value'
      };
      SecureLogger.logObject(obj);
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('"token": "Bear...cdef"')
      );
    });

    it('should log redacted JSON string with label', () => {
      const obj = { password: 'FAKE_PASSWORD_FOR_TESTING' };
      SecureLogger.logObject(obj, 'Test Object');
      expect(core.info).toHaveBeenCalledWith(
        expect.stringMatching(/^Test Object: \{/)
      );
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('"FAKE...TING"')
      );
    });

    it('should handle logging errors', () => {
      const circularObj: Record<string, unknown> = {};
      circularObj['self'] = circularObj;
      SecureLogger.logObject(circularObj);
      expect(core.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to log object:')
      );
    });
  });

  describe('setSecret', () => {
    it('should call core.setSecret for valid secret', () => {
      const secret = 'mysecret';
      SecureLogger.setSecret(secret);
      expect(core.setSecret).toHaveBeenCalledWith(secret);
    });

    it('should not call core.setSecret for empty secret', () => {
      SecureLogger.setSecret('');
      expect(core.setSecret).not.toHaveBeenCalled();
    });

    it('should not call core.setSecret for whitespace-only secret', () => {
      SecureLogger.setSecret('   ');
      expect(core.setSecret).not.toHaveBeenCalled();
    });
  });
});
