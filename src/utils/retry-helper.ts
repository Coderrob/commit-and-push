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

import pRetry, { AbortError } from 'p-retry';
import type { Options } from 'p-retry';
import { SecureLogger } from './secure-logger';

/**
 * Logger interface for retry operations
 */
export interface ILogger {
  warning(message: string): void;
}

/**
 * Type alias for retry configuration using p-retry options
 */
export type RetryConfig = Options;

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  retries: 3,
  factor: 2,
  minTimeout: 1000, // 1 second
  maxTimeout: 10000, // 10 seconds
  randomize: true
};

/**
 * Utility class for implementing retry logic using p-retry
 */
export class RetryHelper {
  /**
   * Executes an operation with retry logic using p-retry
   * @param operation - The async operation to retry
   * @param config - Retry configuration
   * @param logger - Optional logger instance (defaults to SecureLogger)
   * @returns Promise that resolves with the operation result
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig = {},
    logger: ILogger = SecureLogger
  ): Promise<T> {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

    return pRetry(operation, {
      ...finalConfig,
      onFailedAttempt: (error) => {
        logger.warning(
          `Operation failed (attempt ${error.attemptNumber}/${
            (finalConfig.retries ?? 0) + 1
          }). ${error.retriesLeft > 0 ? `Retrying...` : 'No more retries left.'}`
        );

        // Call custom onFailedAttempt handler if provided
        if (finalConfig.onFailedAttempt) {
          return finalConfig.onFailedAttempt(error);
        }
      }
    });
  }

  /**
   * Creates a retryable version of an async function
   * @param fn - The function to make retryable
   * @param config - Retry configuration
   * @param logger - Optional logger instance (defaults to SecureLogger)
   * @returns A retryable version of the function
   */
  static makeRetryable<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    config: RetryConfig = {},
    logger: ILogger = SecureLogger
  ): (...args: T) => Promise<R> {
    return (...args: T) => this.withRetry(() => fn(...args), config, logger);
  }

  /**
   * Determines if an error should abort retries (not be retried)
   * Use this for permanent errors like authentication failures
   * @param error - The error to check
   * @returns AbortError if the error should not be retried
   */
  static abortOnError(error: Error): never {
    throw new AbortError(error.message);
  }

  /**
   * Check if an error is retryable based on common patterns
   * @param error - The error to check
   * @returns true if the error should be retried
   */
  static isRetryableError(error: Error): boolean {
    const retryablePatterns = [
      /network/i,
      /timeout/i,
      /rate limit/i,
      /5\d\d/, // 5xx HTTP status codes
      /429/, // Too Many Requests
      /502/, // Bad Gateway
      /503/, // Service Unavailable
      /504/ // Gateway Timeout
    ];
    return retryablePatterns.some((pattern) => pattern.test(error.message));
  }
}
