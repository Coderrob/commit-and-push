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

import * as fs from 'fs';

import * as core from '@actions/core';

import { GitCommand, Output } from '../types';
import { isError } from '../utils/guards';
import { DirectoryNotFoundError, GitCommandFailedError } from '../errors';
import { GitCommandExecutor } from './common';

import type { IGit } from '../types';
const { ADD, CHECKOUT, COMMIT, CONFIG, FETCH, PUSH, REV_PARSE } = GitCommand;

export class Git implements IGit {
  public async updateConfig(
    userName: string,
    userEmail: string,
    signCommit = false
  ): Promise<number> {
    await GitCommandExecutor.execCommand({
      command: CONFIG,
      args: ['--global', 'user.name', GitCommandExecutor.ensureQuoted(userName)]
    });

    await GitCommandExecutor.execCommand({
      command: CONFIG,
      args: [
        '--global',
        'user.email',
        GitCommandExecutor.ensureQuoted(userEmail)
      ]
    });

    if (signCommit) {
      await GitCommandExecutor.execCommand({
        command: CONFIG,
        args: ['--global', 'commit.gpgsign', signCommit.toString()]
      });
    }
    return core.ExitCode.Success;
  }

  public async fetchLatest(): Promise<number> {
    const { exitCode } = await GitCommandExecutor.execCommand({
      command: FETCH,
      args: ['--all']
    });
    return exitCode;
  }

  public async checkoutBranch(
    branch: string,
    createNew = false
  ): Promise<number> {
    const { exitCode } = await GitCommandExecutor.execCommand({
      command: CHECKOUT,
      args: createNew ? ['-b', branch] : [branch]
    });
    return exitCode;
  }

  public async stageChanges(directoryPath: string): Promise<number> {
    if (!fs.existsSync(directoryPath)) {
      throw new DirectoryNotFoundError(directoryPath);
    }
    const { exitCode } = await GitCommandExecutor.execCommand({
      command: ADD,
      args: [GitCommandExecutor.ensureQuoted(directoryPath)]
    });
    return exitCode;
  }

  public async commitChanges(
    message: string,
    signCommit = false
  ): Promise<number> {
    try {
      const { exitCode } = await GitCommandExecutor.execCommand({
        command: COMMIT,
        args: signCommit
          ? ['-S', '-m', GitCommandExecutor.ensureQuoted(message)]
          : ['-m', GitCommandExecutor.ensureQuoted(message)]
      });
      return exitCode;
    } catch (error) {
      const errMessage = isError(error) ? error.message : String(error);
      if (errMessage.includes('nothing to commit')) {
        core.info(`No changes detected. Skipping commit. ${errMessage}`);
        return 1;
      } else {
        core.error(`Commit failed: ${errMessage}`);
        return 2;
      }
    }
  }

  public async pushChanges(
    remote: string,
    branch: string,
    force = false
  ): Promise<number> {
    const pushExecResult = await GitCommandExecutor.execCommand({
      command: PUSH,
      args: force ? [remote, branch, '--force'] : [remote, branch]
    });

    if (!GitCommandExecutor.isExecOutputSuccess(pushExecResult)) {
      return core.ExitCode.Failure;
    }

    const getCommitHashResult = await GitCommandExecutor.execCommand({
      command: REV_PARSE,
      args: ['HEAD']
    });

    if (!GitCommandExecutor.isExecOutputSuccess(getCommitHashResult)) {
      const message = `Failed to get commit hash: ${getCommitHashResult.stderr}`;
      throw new GitCommandFailedError(message);
    }

    core.setOutput(Output.COMMIT_HASH, getCommitHashResult.stdout);
    return core.ExitCode.Success;
  }
}
