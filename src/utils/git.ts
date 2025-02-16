import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { isError, isString } from './guards.js';
import { DISALLOWED_PATTERNS, ICommand, ALLOWED_COMMANDS } from '../types.js';

/**
 * Sanitizes the input string to prevent security risks.
 * @param input - The input string to sanitize
 * @returns sanitized input string or throws an error if the input is invalid or contains a security risk.
 */
export function sanitizeInput(input: string): string {
  if (!isString(input)) {
    throw new Error('Invalid input type');
  }
  if (DISALLOWED_PATTERNS.some((pattern) => pattern.test(input))) {
    throw new Error(`Security risk detected in input: ${input}`);
  }
  return input;
}

/**
 * Executes a Git command with the provided arguments.
 * @param command - The Git command to execute
 * @returns the exit code of the Git command. If there are any errors, the exit code will be non-zero.
 */
export async function execCommand({
  command,
  args = []
}: ICommand): Promise<number> {
  if (!ALLOWED_COMMANDS.has(command)) {
    throw new Error(`Unauthorized Git command: ${command}`);
  }

  const sanitizedArgs = args.map(sanitizeInput).join(' ');
  const gitCommand = ['git', command, sanitizedArgs].join(' ').trim();

  try {
    const { stdout, stderr } = await exec.getExecOutput(gitCommand);
    core.info(`Git output: ${stdout}`);
    core.info(`Git errors: ${stderr}`);
    return stderr ? 1 : 0;
  } catch (error) {
    const message = isError(error) ? error.message : String(error);
    throw new Error(`Git command failed: ${message}`);
  }
}
