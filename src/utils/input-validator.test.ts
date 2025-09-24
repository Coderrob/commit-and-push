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

import { InputValidator } from './input-validator';
import { SecurityError } from '../errors';

describe('InputValidator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateSecureInput', () => {
    it('should pass validation for safe input', () => {
      expect(() =>
        InputValidator.validateSecureInput('safe-input', 'test-field')
      ).not.toThrow();
    });

    it('should throw SecurityError for path traversal attempts', () => {
      expect(() =>
        InputValidator.validateSecureInput('../malicious', 'test-field')
      ).toThrow(SecurityError);
    });

    it('should throw SecurityError for command injection attempts', () => {
      expect(() =>
        InputValidator.validateSecureInput('input; rm -rf /', 'test-field')
      ).toThrow(SecurityError);
    });

    it('should throw SecurityError for newline characters', () => {
      expect(() =>
        InputValidator.validateSecureInput(
          'input\nwith\nnewlines',
          'test-field'
        )
      ).toThrow(SecurityError);
    });

    it('should throw SecurityError for backticks', () => {
      expect(() =>
        InputValidator.validateSecureInput('input`with`backticks', 'test-field')
      ).toThrow(SecurityError);
    });

    it('should throw SecurityError for dollar signs', () => {
      expect(() =>
        InputValidator.validateSecureInput('input$with$dollar', 'test-field')
      ).toThrow(SecurityError);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(InputValidator.isValidEmail('user@example.com')).toBe(true);
      expect(InputValidator.isValidEmail('test.email+tag@domain.co.uk')).toBe(
        true
      );
    });

    it('should return false for invalid email addresses', () => {
      expect(InputValidator.isValidEmail('invalid-email')).toBe(false);
      expect(InputValidator.isValidEmail('@domain.com')).toBe(false);
      expect(InputValidator.isValidEmail('user@')).toBe(false);
      expect(InputValidator.isValidEmail('')).toBe(false);
    });
  });

  describe('isValidRepositoryFormat', () => {
    it('should return true for valid repository format', () => {
      expect(InputValidator.isValidRepositoryFormat('owner/repo')).toBe(true);
      expect(InputValidator.isValidRepositoryFormat('org-name/repo-name')).toBe(
        true
      );
    });

    it('should return false for invalid repository format', () => {
      expect(InputValidator.isValidRepositoryFormat('invalid')).toBe(false);
      expect(InputValidator.isValidRepositoryFormat('/repo')).toBe(false);
      expect(InputValidator.isValidRepositoryFormat('owner/')).toBe(false);
      expect(InputValidator.isValidRepositoryFormat('')).toBe(false);
      expect(InputValidator.isValidRepositoryFormat('owner/repo/extra')).toBe(
        false
      );
    });
  });
});
