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

import { SecurityError } from './security-error';

describe('SecurityError', () => {
  it('should create an error with the correct name and message', () => {
    const error = new SecurityError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('SecurityError');
    expect(error.message).toBe('Security risk detected');
  });

  it('should create an error with a custom message', () => {
    const customMessage = 'Custom security error message';
    const error = new SecurityError(customMessage);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('SecurityError');
    expect(error.message).toBe(customMessage);
  });
});
