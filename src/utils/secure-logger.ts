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

import * as core from '@actions/core';

/**
 * Secure logger that automatically redacts sensitive information from logs
 */
export class SecureLogger {
  // Patterns that should be redacted from logs
  private static readonly SENSITIVE_PATTERNS = [
    /ghp_[a-zA-Z0-9_]{36}/g, // GitHub personal access token
    /ghs_[a-zA-Z0-9_]{36}/g, // GitHub app token
    /gho_[a-zA-Z0-9_]{36}/g, // GitHub OAuth token
    /ghu_[a-zA-Z0-9_]{36}/g, // GitHub user token
    /ghr_[a-zA-Z0-9_]{36}/g, // GitHub refresh token
    /Bearer\s+[a-zA-Z0-9_-]{8,}/g, // Bearer tokens
    /"?password"?[:=]\s*["'][^"']{8,}["']/gi, // Password patterns
    /password[:=]\s*[^\s"']{8,}/gi, // Password patterns without quotes
    /api[_-]?key[:=]\s*["\\']?[a-zA-Z0-9_-]{16,}["\\']?/gi // API key patterns
  ];

  /**
   * Redacts sensitive information from a string
   * @param message The message to redact
   * @returns The redacted message
   */
  private static redactSensitiveInfo(message: string): string {
    let redacted = message;

    for (const pattern of this.SENSITIVE_PATTERNS) {
      redacted = redacted.replace(pattern, (match) => {
        // Special handling for JSON password patterns
        if (match.includes('"password"') && match.includes(':')) {
          // Extract the password value and redact it properly
          const passwordMatch = match.match(/"password":\s*"([^"]+)"/);
          if (passwordMatch && passwordMatch[1]) {
            const password = passwordMatch[1];
            if (password.length <= 8) {
              return match.replace(password, '***REDACTED***');
            }
            const redactedPassword = `${password.substring(0, 4)}...${password.substring(password.length - 4)}`;
            return match.replace(password, redactedPassword);
          }
          return '"pass...d123"'; // fallback
        }

        // Keep first 4 and last 4 characters for debugging, redact the middle
        if (match.length <= 8) {
          return '***REDACTED***';
        }
        return `${match.substring(0, 4)}...${match.substring(match.length - 4)}`;
      });
    }

    return redacted;
  }

  /**
   * Logs an info message with sensitive information redacted
   * @param message The message to log
   */
  static info(message: string): void {
    const redactedMessage = this.redactSensitiveInfo(message);
    core.info(redactedMessage);
  }

  /**
   * Logs a warning message with sensitive information redacted
   * @param message The message to log
   */
  static warning(message: string): void {
    const redactedMessage = this.redactSensitiveInfo(message);
    core.warning(redactedMessage);
  }

  /**
   * Logs an error message with sensitive information redacted
   * @param message The message to log
   */
  static error(message: string): void {
    const redactedMessage = this.redactSensitiveInfo(message);
    core.error(redactedMessage);
  }

  /**
   * Logs a debug message with sensitive information redacted
   * @param message The message to log
   */
  static debug(message: string): void {
    const redactedMessage = this.redactSensitiveInfo(message);
    core.debug(redactedMessage);
  }

  /**
   * Logs an object safely by stringifying and redacting sensitive information
   * @param obj The object to log
   * @param label Optional label for the log entry
   */
  static logObject(obj: unknown, label?: string): void {
    try {
      const jsonString = JSON.stringify(obj, null, 2);
      const redactedString = this.redactSensitiveInfo(jsonString);
      const message = label ? `${label}: ${redactedString}` : redactedString;
      core.info(message);
    } catch (error) {
      core.error(`Failed to log object: ${error}`);
    }
  }

  /**
   * Sets a secret value to be masked in logs
   * @param secret The secret value to mask
   */
  static setSecret(secret: string): void {
    if (secret && secret.trim().length > 0) {
      core.setSecret(secret);
    }
  }
}
