import * as core from '@actions/core';
import { SecureLogger } from './secure-logger';

jest.mock('@actions/core');

describe('SecureLogger', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('redactSensitiveInfo (tested via public methods)', () => {
    it('should redact GitHub personal access tokens', () => {
      const message = 'Token: ghp_1234567890abcdef1234567890abcdef123456';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('Token: ghp_...123456');
    });

    it('should redact Bearer tokens', () => {
      const message = 'Authorization: Bearer abcdefghijklmnopqrstuvwxyz';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('Authorization: Bear...wxyz');
    });

    it('should redact passwords', () => {
      const message = 'password: mysecretpassword123';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('pass...d123');
    });

    it('should redact API keys', () => {
      const message = 'api_key: abcdefghijklmnopqrstuvwxyz123456';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('api_...3456');
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
      const message =
        'Info with token: ghp_1234567890abcdef1234567890abcdef123456';
      SecureLogger.info(message);
      expect(core.info).toHaveBeenCalledWith('Info with token: ghp_...123456');
    });
  });

  describe('warning', () => {
    it('should call core.warning with redacted message', () => {
      const message = 'Warning with password: mysecretpassword123';
      SecureLogger.warning(message);
      expect(core.warning).toHaveBeenCalledWith('Warning with pass...d123');
    });
  });

  describe('error', () => {
    it('should call core.error with redacted message', () => {
      const message = 'Error with api_key: abcdefghijklmnopqrstuvwxyz123456';
      SecureLogger.error(message);
      expect(core.error).toHaveBeenCalledWith('Error with api_...3456');
    });
  });

  describe('debug', () => {
    it('should call core.debug with redacted message', () => {
      const message = 'Debug with Bearer abcdefghijklmnopqrstuvwxyz';
      SecureLogger.debug(message);
      expect(core.debug).toHaveBeenCalledWith('Debug with Bear...wxyz');
    });
  });

  describe('logObject', () => {
    it('should log redacted JSON string without label', () => {
      const obj = {
        token: 'ghp_1234567890abcdef1234567890abcdef123456',
        normal: 'value'
      };
      SecureLogger.logObject(obj);
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('"token": "ghp_...123456"')
      );
    });

    it('should log redacted JSON string with label', () => {
      const obj = { password: 'mysecretpassword123' };
      SecureLogger.logObject(obj, 'Test Object');
      expect(core.info).toHaveBeenCalledWith(
        expect.stringMatching(/^Test Object: \{/)
      );
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('"password": "mysecretpassword123"')
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
