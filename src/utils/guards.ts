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
