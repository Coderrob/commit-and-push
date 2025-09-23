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

import { DISALLOWED_PATTERNS } from '../types';
import { SecurityError } from '../errors';

/**
 * Utility class for input validation and sanitization.
 */
export class InputValidator {
  /**
   * Validates that an input string doesn't contain potentially dangerous patterns.
   * @param input - The input string to validate
   * @param fieldName - The name of the field being validated (for error messages)
   * @throws SecurityError if the input contains disallowed patterns
   */
  static validateSecureInput(input: string, fieldName: string): void {
    for (const pattern of DISALLOWED_PATTERNS) {
      if (pattern.test(input)) {
        throw new SecurityError(
          `Invalid ${fieldName}: contains disallowed pattern ${pattern.source}`
        );
      }
    }
  }

  /**
   * Validates email format using a simple regex.
   * @param email - The email to validate
   * @returns true if email format is valid
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates repository format (owner/repo).
   * @param repository - The repository string to validate
   * @returns true if repository format is valid
   */
  static isValidRepositoryFormat(repository: string): boolean {
    if (!repository || !repository.includes('/')) {
      return false;
    }
    const parts = repository.split('/');
    return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
  }
}
