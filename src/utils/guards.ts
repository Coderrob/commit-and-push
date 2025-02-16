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
