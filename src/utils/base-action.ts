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
import { ExitCode } from '@actions/core';
import { GitCommand, ICommitAndPush, Input, Output } from '../types.js';
import { execCommand, isExecOutputSuccess } from './git.js';
import { isError, isTrue } from './guards.js';
import { ensureQuoted } from './common.js';

const { ADD, CONFIG, FETCH, CHECKOUT, COMMIT, PUSH, REV_PARSE } = GitCommand;

export abstract class BaseAction implements ICommitAndPush {
  private readonly authorEmail: string;
  private readonly authorName: string;
  private readonly branch: string;
  private readonly commitMessage: string;
  private readonly directoryPath: string;
  private readonly forcePush: boolean;
  private readonly remoteRef: string;
  private readonly createBranch: boolean;
  private readonly signCommit: boolean;

  constructor({
    [Input.AUTHOR_EMAIL]: authorEmail,
    [Input.AUTHOR_NAME]: authorName,
    [Input.BRANCH_TARGET]: branch,
    [Input.COMMIT_MESSAGE]: commitMessage,
    [Input.CREATE_BRANCH]: createBranch,
    [Input.DIRECTORY_PATH]: directoryPath,
    [Input.FORCE_PUSH]: forcePush,
    [Input.REMOTE_REF]: remoteRef,
    [Input.SIGN_COMMIT]: signCommit
  }: Record<Input, string>) {
    this.authorEmail = authorEmail;
    this.authorName = authorName;
    this.branch = branch;
    this.commitMessage = commitMessage;
    this.createBranch = isTrue(createBranch);
    this.directoryPath = directoryPath;
    this.forcePush = isTrue(forcePush);
    this.remoteRef = remoteRef;
    this.signCommit = isTrue(signCommit);
  }

  async updateConfig(): Promise<number> {
    // Set the required global git user name
    await execCommand({
      command: CONFIG,
      args: ['--global', 'user.name', ensureQuoted(this.authorName)]
    });
    // Set the required global git user email
    await execCommand({
      command: CONFIG,
      args: ['--global', 'user.email', ensureQuoted(this.authorEmail)]
    });
    // Enable GPG signing if requested
    if (this.signCommit) {
      await execCommand({
        command: CONFIG,
        args: ['--global', 'commit.gpgsign', 'true']
      });
    }
    return ExitCode.Success;
  }

  async fetchLatest(): Promise<number> {
    const { exitCode } = await execCommand({
      command: FETCH,
      args: ['--all']
    });
    return exitCode;
  }

  async checkoutBranch(): Promise<number> {
    const { exitCode } = await execCommand({
      command: CHECKOUT,
      args: this.createBranch ? ['-b', this.branch] : [this.branch]
    });
    return exitCode;
  }

  async stageChanges(): Promise<number> {
    const { exitCode } = await execCommand({
      command: ADD,
      args: [ensureQuoted(this.directoryPath)]
    });
    return exitCode;
  }

  async commitChanges(): Promise<number> {
    try {
      const { exitCode } = await execCommand({
        command: COMMIT,
        args: this.signCommit
          ? ['-S', '-m', ensureQuoted(this.commitMessage)]
          : ['-m', ensureQuoted(this.commitMessage)]
      });
      return exitCode;
    } catch (error) {
      const message = isError(error) ? error.message : String(error);
      core.info(`No changes detected. Skipping commit. ${message}`);
      return ExitCode.Success;
    }
  }

  async pushChanges(): Promise<number> {
    const pushExecResult = await execCommand({
      command: PUSH,
      args: this.forcePush
        ? [this.remoteRef, this.branch, '--force']
        : [this.remoteRef, this.branch]
    });

    if (!isExecOutputSuccess(pushExecResult)) {
      return ExitCode.Failure;
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
