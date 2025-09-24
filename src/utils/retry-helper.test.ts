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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { RetryHelper, DEFAULT_RETRY_CONFIG } from './retry-helper';

// Import p-retry - Jest will automatically use the mock from __mocks__/p-retry/index.js
import pRetry from 'p-retry';

// Get reference to the mock function for test manipulation
// Cast to any to avoid TypeScript conflicts with the mock implementation
const mockPRetry = pRetry as any;

describe('RetryHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const mockOperation = jest.fn().mockResolvedValue('success');
      mockPRetry.mockImplementation((fn: any) => fn());

      const result = await RetryHelper.withRetry(mockOperation);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(mockPRetry).toHaveBeenCalledWith(
        mockOperation,
        expect.objectContaining({
          retries: 3,
          minTimeout: 1000,
          maxTimeout: 10000,
          factor: 2,
          randomize: true
        })
      );
    });

    it('should retry on retryable error and eventually succeed', async () => {
      const mockOperation = jest
        .fn()
        .mockRejectedValueOnce(new Error('network timeout'))
        .mockRejectedValueOnce(new Error('502 Bad Gateway'))
        .mockResolvedValue('success');

      mockPRetry.mockImplementation(async (fn: any, options: any) => {
        // Simulate retry behavior
        for (let i = 0; i <= options.retries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i === options.retries) {
              throw error;
            }
          }
        }
      });

      const result = await RetryHelper.withRetry(mockOperation, {
        retries: 2,
        minTimeout: 10
      });

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(3);
      expect(mockPRetry).toHaveBeenCalledWith(
        mockOperation,
        expect.objectContaining({
          retries: 2,
          minTimeout: 10
        })
      );
    });

    it('should fail after max attempts', async () => {
      const mockOperation = jest
        .fn()
        .mockRejectedValue(new Error('persistent network error'));

      mockPRetry.mockImplementation(async (fn: any, options: any) => {
        // Simulate retry behavior that eventually fails
        for (let i = 0; i <= options.retries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i === options.retries) {
              throw error;
            }
          }
        }
      });

      await expect(
        RetryHelper.withRetry(mockOperation, {
          retries: 1,
          minTimeout: 10
        })
      ).rejects.toThrow('persistent network error');

      expect(mockOperation).toHaveBeenCalledTimes(2);
      expect(mockPRetry).toHaveBeenCalledWith(
        mockOperation,
        expect.objectContaining({
          retries: 1,
          minTimeout: 10
        })
      );
    });

    it('should not retry non-retryable errors', async () => {
      const mockOperation = jest.fn().mockImplementation(() => {
        // Use AbortError to prevent retries
        const error = new Error('Invalid input');
        return Promise.reject(RetryHelper.abortOnError(error));
      });

      mockPRetry.mockImplementation(async (fn: any) => {
        // Simulate AbortError behavior - no retries
        return await fn();
      });

      await expect(
        RetryHelper.withRetry(mockOperation, { retries: 2 })
      ).rejects.toThrow('Invalid input');

      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(mockPRetry).toHaveBeenCalledWith(
        mockOperation,
        expect.objectContaining({
          retries: 2
        })
      );
    });

    it('should use default retry configuration', async () => {
      const mockOperation = jest
        .fn()
        .mockRejectedValue(new Error('rate limit exceeded'));

      mockPRetry.mockImplementation(async (fn: any, options: any) => {
        // Simulate retry behavior that eventually fails
        for (let i = 0; i <= options.retries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i === options.retries) {
              throw error;
            }
          }
        }
      });

      await expect(RetryHelper.withRetry(mockOperation)).rejects.toThrow();

      expect(mockOperation).toHaveBeenCalledTimes(
        (DEFAULT_RETRY_CONFIG.retries ?? 0) + 1
      );
      expect(mockPRetry).toHaveBeenCalledWith(
        mockOperation,
        expect.objectContaining(DEFAULT_RETRY_CONFIG)
      );
    });

    it('should handle custom retry configuration', async () => {
      const mockOperation = jest
        .fn()
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockResolvedValue('success');

      const customConfig = {
        retries: 1,
        minTimeout: 10
      };

      mockPRetry.mockImplementation(async (fn: any, options: any) => {
        // Simulate retry behavior with custom config
        for (let i = 0; i <= options.retries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i === options.retries) {
              throw error;
            }
          }
        }
      });

      const result = await RetryHelper.withRetry(mockOperation, customConfig);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(2);
      expect(mockPRetry).toHaveBeenCalledWith(
        mockOperation,
        expect.objectContaining(customConfig)
      );
    });
  });

  describe('makeRetryable', () => {
    it('should create a retryable version of a function', async () => {
      const originalFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      mockPRetry.mockImplementation(async (fn: any, options: any) => {
        // Simulate retry behavior
        for (let i = 0; i <= options.retries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i === options.retries) {
              throw error;
            }
          }
        }
      });

      const retryableFn = RetryHelper.makeRetryable(originalFn, {
        retries: 1,
        minTimeout: 10
      });

      const result = await retryableFn('arg1', 'arg2');

      expect(result).toBe('success');
      expect(originalFn).toHaveBeenCalledTimes(2);
      expect(originalFn).toHaveBeenNthCalledWith(1, 'arg1', 'arg2');
      expect(originalFn).toHaveBeenNthCalledWith(2, 'arg1', 'arg2');
    });
  });

  describe('default retry config', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_RETRY_CONFIG.retries).toBe(3);
      expect(DEFAULT_RETRY_CONFIG.minTimeout).toBe(1000);
      expect(DEFAULT_RETRY_CONFIG.maxTimeout).toBe(10000);
      expect(DEFAULT_RETRY_CONFIG.factor).toBe(2);
      expect(DEFAULT_RETRY_CONFIG.randomize).toBe(true);
    });
  });

  describe('isRetryableError', () => {
    it('should identify retryable errors correctly', () => {
      expect(RetryHelper.isRetryableError(new Error('network timeout'))).toBe(
        true
      );
      expect(RetryHelper.isRetryableError(new Error('502 Bad Gateway'))).toBe(
        true
      );
      expect(
        RetryHelper.isRetryableError(new Error('503 Service Unavailable'))
      ).toBe(true);
      expect(
        RetryHelper.isRetryableError(new Error('rate limit exceeded'))
      ).toBe(true);
      expect(RetryHelper.isRetryableError(new Error('Invalid input'))).toBe(
        false
      );
      expect(RetryHelper.isRetryableError(new Error('404 Not Found'))).toBe(
        false
      );
    });
  });

  describe('abortOnError', () => {
    it('should throw AbortError with the provided error message', () => {
      const error = new Error('Test error message');

      expect(() => RetryHelper.abortOnError(error)).toThrow(
        'Test error message'
      );

      // Check that it throws an error with name 'AbortError'
      let thrownError: Error | null = null;
      try {
        RetryHelper.abortOnError(error);
      } catch (err) {
        thrownError = err as Error;
      }

      expect(thrownError).not.toBeNull();
      expect(thrownError!.name).toBe('AbortError');
      expect(thrownError!.message).toBe('Test error message');
    });

    it('should throw AbortError for different error messages', () => {
      const error1 = new Error('Network failure');
      const error2 = new Error('Authentication failed');

      expect(() => RetryHelper.abortOnError(error1)).toThrow('Network failure');
      expect(() => RetryHelper.abortOnError(error2)).toThrow(
        'Authentication failed'
      );

      // Check that both throw errors with name 'AbortError'
      let thrownError1: Error | null = null;
      try {
        RetryHelper.abortOnError(error1);
      } catch (err) {
        thrownError1 = err as Error;
      }

      let thrownError2: Error | null = null;
      try {
        RetryHelper.abortOnError(error2);
      } catch (err) {
        thrownError2 = err as Error;
      }

      expect(thrownError1).not.toBeNull();
      expect(thrownError1!.name).toBe('AbortError');
      expect(thrownError2).not.toBeNull();
      expect(thrownError2!.name).toBe('AbortError');
    });
  });

  describe('logger integration', () => {
    it('should use provided logger for warning messages', async () => {
      const mockLogger = {
        warning: jest.fn()
      };

      const originalFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      mockPRetry.mockImplementation(async (fn: any, options: any) => {
        // Simulate retry behavior with logging
        for (let i = 0; i <= options.retries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i < options.retries) {
              // Simulate what p-retry would do - call onFailedAttempt if provided
              if (options.onFailedAttempt) {
                await options.onFailedAttempt(error);
              }
            } else {
              throw error;
            }
          }
        }
      });

      await RetryHelper.withRetry(originalFn, { retries: 1 }, mockLogger);

      // Verify the mock logger was called
      expect(mockLogger.warning).toHaveBeenCalled();
    });

    it('should use default SecureLogger when no logger provided', async () => {
      const originalFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success');

      // Mock the SecureLogger warning method
      const { SecureLogger } = await import('./secure-logger');
      const mockWarning = jest
        .spyOn(SecureLogger, 'warning')
        .mockImplementation(() => {});

      mockPRetry.mockImplementation(async (fn: any, options: any) => {
        // Simulate retry behavior with logging
        for (let i = 0; i <= options.retries; i++) {
          try {
            return await fn();
          } catch (error) {
            if (i < options.retries) {
              // Simulate what p-retry would do - call onFailedAttempt if provided
              if (options.onFailedAttempt) {
                await options.onFailedAttempt(error);
              }
            } else {
              throw error;
            }
          }
        }
      });

      await RetryHelper.withRetry(originalFn, { retries: 1 });

      // Verify SecureLogger was used
      expect(mockWarning).toHaveBeenCalled();

      mockWarning.mockRestore();
    });
  });
});
