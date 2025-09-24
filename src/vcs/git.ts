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
  /**
   * Updates the Git configuration with user name, email, and optional GPG signing.
   * @param userName - The user name to set in Git config
   * @param userEmail - The user email to set in Git config
   * @param signCommit - Whether to enable GPG signing for commits
   * @returns Promise resolving to exit code (0 for success)
   */
  public async updateConfig(
    userName: string,
    userEmail: string,
    signCommit = false
  ): Promise<number> {
    await GitCommandExecutor.execCommand({
      command: CONFIG,
      args: ['--local', 'user.name', GitCommandExecutor.ensureQuoted(userName)]
    });

    await GitCommandExecutor.execCommand({
      command: CONFIG,
      args: [
        '--local',
        'user.email',
        GitCommandExecutor.ensureQuoted(userEmail)
      ]
    });

    if (signCommit) {
      await GitCommandExecutor.execCommand({
        command: CONFIG,
        args: ['--local', 'commit.gpgsign', signCommit.toString()]
      });
    }
    return core.ExitCode.Success;
  }

  /**
   * Fetches the latest changes from all remotes.
   * @returns Promise resolving to exit code (0 for success)
   */
  public async fetchLatest(): Promise<number> {
    const { exitCode } = await GitCommandExecutor.execCommand({
      command: FETCH,
      args: ['--all']
    });
    return exitCode;
  }

  /**
   * Checks out the specified branch, optionally creating it if it doesn't exist.
   * @param branch - The name of the branch to check out
   * @param createNew - Whether to create the branch if it doesn't exist
   * @returns Promise resolving to exit code (0 for success)
   */
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

  /**
   * Stages changes in the specified directory for commit.
   * @param directoryPath - The path to the directory containing files to stage
   * @returns Promise resolving to exit code (0 for success)
   * @throws DirectoryNotFoundError if the directory doesn't exist
   */
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

  /**
   * Commits the staged changes with the specified message.
   * @param message - The commit message
   * @param signCommit - Whether to sign the commit with GPG
   * @returns Promise resolving to exit code (0 for success, 1 for no changes, 2 for error)
   */
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

  /**
   * Pushes the committed changes to the remote repository and sets the commit hash output.
   * @param remote - The remote repository reference
   * @param branch - The branch to push to
   * @param force - Whether to force push
   * @returns Promise resolving to exit code (0 for success)
   * @throws GitCommandFailedError if getting commit hash fails
   */
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
