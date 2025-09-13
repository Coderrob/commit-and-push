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

import { ALLOWED_COMMANDS, DISALLOWED_PATTERNS, Quote } from '../types';
import { isError, isString } from '../utils/guards';
import {
  InvalidInputError,
  SecurityError,
  UnauthorizedCommandError,
  GitCommandFailedError
} from '../errors';

import type { IGitCommand } from '../types';
export class GitCommandExecutor {
  static ensureQuoted(value: string, quote = Quote.DOUBLE): string {
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

  static isExecOutputSuccess({ exitCode }: exec.ExecOutput): boolean {
    return exitCode === core.ExitCode.Success;
  }

  static sanitizeInput(input: string): string {
    if (!isString(input)) {
      throw new InvalidInputError();
    }
    if (DISALLOWED_PATTERNS.some((pattern) => pattern.test(input))) {
      throw new SecurityError(`Security risk detected in input: ${input}`);
    }
    return input;
  }

  static async execCommand({
    command,
    args = []
  }: IGitCommand): Promise<exec.ExecOutput> {
    if (!ALLOWED_COMMANDS.some((allowed) => allowed === command)) {
      throw new UnauthorizedCommandError(command);
    }

    const sanitizedArgs = args.map(this.sanitizeInput).join(' ');
    const gitCommand = ['git', command, sanitizedArgs].join(' ').trim();

    try {
      const { exitCode, stdout, stderr } = await exec.getExecOutput(gitCommand);
      core.info(`Git output: ${stdout}`);
      core.info(`Git errors: ${stderr}`);
      return { exitCode, stdout, stderr };
    } catch (error) {
      const message = isError(error) ? error.message : String(error);
      throw new GitCommandFailedError(message);
    }
  }
}

export const ensureQuoted = GitCommandExecutor.ensureQuoted;
export const execCommand =
  GitCommandExecutor.execCommand.bind(GitCommandExecutor);
export const isExecOutputSuccess = GitCommandExecutor.isExecOutputSuccess;
export const sanitizeInput = GitCommandExecutor.sanitizeInput;
