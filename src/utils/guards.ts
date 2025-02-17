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

/**
 * Checks if the provided value is a string.
 * @param value - The value to check.
 * @returns true if the value is a string; false otherwise.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if the provided value is an instance of `Error`.
 * @param error - The error to check.
 * @returns true if the value is an instance of `Error`; false otherwise.
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Checks if the provided value is a true boolean,
 * a string "true" (case-insensitive), or maybe it's mayboolean...
 * @param value - The value to check.
 * @returns true if the value is a true boolean or a string "true" (case-insensitive); false otherwise.
 */
export function isTrue(value: unknown): value is boolean {
  // Check for trueBool ahead...
  const trueBool = typeof value === 'boolean' && value === true;
  const trueStr = typeof value === 'string' && value.toLowerCase() === 'true';
  return trueBool || trueStr;
}
