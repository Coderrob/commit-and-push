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
import * as exec from '@actions/exec';
import { ALLOWED_COMMANDS, DISALLOWED_PATTERNS, ICommand } from '../types.js';
import { isError, isString } from './guards.js';

/**
 * Enum representing different types of quotes.
 */
enum Quote {
  SINGLE = "'",
  DOUBLE = '"'
}

/**
 * Ensures that a string is quoted with the specified quote character.
 * @param value The string to be quoted.
 * @param quote The quote character to use for quoting. Defaults to double quotes (`"`).
 * @returns The quoted string.
 */
export function ensureQuoted(value: string, quote = Quote.DOUBLE): string {
  const length = value.length;
  const hasDoubleQuotes =
    length > 1 &&
    value.startsWith(Quote.DOUBLE) &&
    value.endsWith(Quote.DOUBLE);
  const hasSingleQuotes =
    length > 1 &&
    value.startsWith(Quote.SINGLE) &&
    value.endsWith(Quote.SINGLE);
  return hasDoubleQuotes || hasSingleQuotes
    ? value
    : [quote, value, quote].join('');
}

/**
 * Checks if the command execution resulted in successful
 * exit code response. Successful being defined as an exit code of `0`.
 * @param {ExecOutput} execOutput  An object containing the command and arguments to execute
 * @returns {boolean} The output of the executed command
 */
export function isExecOutputSuccess({ exitCode }: exec.ExecOutput): boolean {
  return exitCode === core.ExitCode.Success;
}

/**
 * Sanitizes the input string to prevent security risks.
 * @param input The input string to sanitize
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
 * @param command The Git command to execute
 * @returns the exit code of the Git command. If there are any errors,
 * the exit code will be non-zero.
 */
export async function execCommand({
  command,
  args = []
}: ICommand): Promise<exec.ExecOutput> {
  if (!ALLOWED_COMMANDS.some((allowed) => allowed === command)) {
    throw new Error(`Unauthorized Git command: ${command}`);
  }

  const sanitizedArgs = args.map(sanitizeInput).join(' ');
  const gitCommand = ['git', command, sanitizedArgs].join(' ').trim();

  try {
    const { exitCode, stdout, stderr } = await exec.getExecOutput(gitCommand);
    core.info(`Git output: ${stdout}`);
    core.info(`Git errors: ${stderr}`);
    return {
      exitCode,
      stdout,
      stderr
    };
  } catch (error) {
    const message = isError(error) ? error.message : String(error);
    throw new Error(`Git command failed: ${message}`);
  }
}
