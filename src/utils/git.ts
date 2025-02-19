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

import { GitCommand, IGit, Output } from '../types.js';
import { ensureQuoted, execCommand, isExecOutputSuccess } from './common.js';
import { isError } from './guards.js';

const { ADD, CHECKOUT, COMMIT, CONFIG, FETCH, PUSH, REV_PARSE } = GitCommand;

/**
 * Class that encapsulates the Git command operations.
 */
export class Git implements IGit {
  /**
   * Updates the global git configuration with the provided user name and email.
   * Optionally enables GPG signing for commits.
   * @param userName The name of the user to set as the global git user.
   * @param userEmail The email of the user to set as the global git user.
   * @param signCommit Optional flag to enable GPG signing for commits.
   * @returns  Promise<number> The exit code of the git config command.
   */
  public async updateConfig(
    userName: string,
    userEmail: string,
    signCommit = false
  ): Promise<number> {
    await execCommand({
      command: CONFIG,
      args: ['--global', 'user.name', ensureQuoted(userName)]
    });

    await execCommand({
      command: CONFIG,
      args: ['--global', 'user.email', ensureQuoted(userEmail)]
    });

    if (signCommit) {
      await execCommand({
        command: CONFIG,
        args: ['--global', 'commit.gpgsign', signCommit.toString()]
      });
    }
    return core.ExitCode.Success;
  }

  /**
   * Fetch the latest changes from all remote repositories.
   * @returns Promise<number> The exit code of the fetch operation.
   */
  public async fetchLatest(): Promise<number> {
    const { exitCode } = await execCommand({
      command: FETCH,
      args: ['--all']
    });
    return exitCode;
  }

  /**
   * Checkout a branch. If the branch does not exist and createNew is true, it will be created.
   * @param branch The name of the branch to checkout.
   * @param createNew Whether to create the branch if it does not exist.
   * @returns Promise<number> The exit code of the checkout operation.
   */
  public async checkoutBranch(
    branch: string,
    createNew = false
  ): Promise<number> {
    const { exitCode } = await execCommand({
      command: CHECKOUT,
      args: createNew ? ['-b', branch] : [branch]
    });
    return exitCode;
  }

  /**
   * Stage changes in a directory.
   * @param directoryPath The path of the directory to stage changes for.
   * @returns Promise<number> The exit code of the stage operation.
   */
  public async stageChanges(directoryPath: string): Promise<number> {
    const { exitCode } = await execCommand({
      command: ADD,
      args: [ensureQuoted(directoryPath)]
    });
    return exitCode;
  }

  /**
   * Commit changes with a message.
   * @param message The commit message.
   * @param signCommit Whether to sign the commit.
   * @returns Promise<number> The exit code of the commit operation.
   */
  public async commitChanges(
    message: string,
    signCommit = false
  ): Promise<number> {
    try {
      const { exitCode } = await execCommand({
        command: COMMIT,
        args: signCommit
          ? ['-S', '-m', ensureQuoted(message)]
          : ['-m', ensureQuoted(message)]
      });
      return exitCode;
    } catch (error) {
      const errMessage = isError(error) ? error.message : String(error);
      core.info(`No changes detected. Skipping commit. ${errMessage}`);
      return core.ExitCode.Success;
    }
  }

  /**
   * Push changes to a remote repository.
   * @param remote The name of the remote repository.
   * @param branch The name of the branch to push.
   * @param force Whether to force push.
   * @returns Promise<number> The exit code of the push operation.
   */
  public async pushChanges(
    remote: string,
    branch: string,
    force = false
  ): Promise<number> {
    const pushExecResult = await execCommand({
      command: PUSH,
      args: force ? [remote, branch, '--force'] : [remote, branch]
    });

    if (!isExecOutputSuccess(pushExecResult)) {
      return core.ExitCode.Failure;
    }

    const getCommitHashResult = await execCommand({
      command: REV_PARSE,
      args: ['HEAD']
    });

    if (!isExecOutputSuccess(getCommitHashResult)) {
      const message = `Failed to get commit hash: ${getCommitHashResult.stderr}`;
      throw new Error(message);
    }

    core.setOutput(Output.COMMIT_HASH, getCommitHashResult.stdout);
    return core.ExitCode.Success;
  }
}
