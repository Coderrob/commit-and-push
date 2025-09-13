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

import {
  CheckoutBranchCommand,
  CommitChangesCommand,
  CreatePullRequestCommand,
  FetchLatestCommand,
  PushChangesCommand,
  StageChangesCommand,
  UpdateConfigCommand
} from './commands';
import { NoChangesError, InvalidRepositoryFormatError } from './errors';
import { GitHubClient } from './services/github/github-client';
import { Input } from './types';
import { isError, isTrue } from './utils/guards';
import { Git } from './vcs/git';

import type { IExecute, ICommand, IGit, IGitHubClient } from './types';

export class Action implements IExecute {
  private readonly commands: ICommand[] = [];

  constructor(
    inputs: Record<Input, string>,
    private readonly git: IGit = new Git(),
    private readonly gitHub?: IGitHubClient
  ) {
    if (!inputs[Input.REPOSITORY] || !inputs[Input.REPOSITORY].includes('/')) {
      throw new InvalidRepositoryFormatError();
    }
    const parts = inputs[Input.REPOSITORY].split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new InvalidRepositoryFormatError();
    }
    const [owner, repo] = parts;
    const params = {
      authorEmail: inputs[Input.AUTHOR_EMAIL],
      authorName: inputs[Input.AUTHOR_NAME],
      branch: inputs[Input.BRANCH],
      commitMessage: inputs[Input.COMMIT_MESSAGE],
      createBranch: isTrue(inputs[Input.CREATE_BRANCH]),
      directoryPath: inputs[Input.DIRECTORY_PATH],
      fetchLatest: isTrue(inputs[Input.FETCH_LATEST]),
      forcePush: isTrue(inputs[Input.FORCE_PUSH]),
      githubToken: inputs[Input.GITHUB_TOKEN],
      openPullRequest: isTrue(inputs[Input.OPEN_PULL_REQUEST]),
      remoteRef: inputs[Input.REMOTE_REF],
      repository: inputs[Input.REPOSITORY],
      signCommit: isTrue(inputs[Input.SIGN_COMMIT])
    };

    const gitHubClient =
      this.gitHub ||
      new GitHubClient({
        baseUrl: `https://api.${inputs[Input.GITHUB_HOSTNAME]}`,
        token: inputs[Input.GITHUB_TOKEN],
        owner,
        repo
      });

    this.commands.push(
      new UpdateConfigCommand(
        this.git,
        params.authorName,
        params.authorEmail,
        params.signCommit
      )
    );

    if (params.fetchLatest) {
      this.commands.push(new FetchLatestCommand(this.git));
    }

    this.commands.push(
      new CheckoutBranchCommand(this.git, params.branch, params.createBranch)
    );
    this.commands.push(new StageChangesCommand(this.git, params.directoryPath));

    const commitCommand = new CommitChangesCommand(
      this.git,
      params.commitMessage,
      params.signCommit
    );
    this.commands.push(commitCommand);

    this.commands.push(
      new PushChangesCommand(
        this.git,
        params.remoteRef,
        params.branch,
        params.forcePush
      )
    );

    if (params.openPullRequest) {
      this.commands.push(
        new CreatePullRequestCommand(gitHubClient, params.branch)
      );
    }
  }

  async execute(): Promise<void> {
    try {
      for (const command of this.commands) {
        await command.execute();
      }
    } catch (error) {
      // Some modules may throw a plain Error with the same message instead of
      // the NoChangesError class instance (module duplication during refactor).
      const isNoChanges =
        error instanceof NoChangesError ||
        (isError(error) && error.message === 'No changes to commit');
      if (isNoChanges) {
        core.info('No changes to commit. Skipping push and pull request.');
        return;
      }

      let message = isError(error) ? error.message : 'Unknown error';
      // Provide additional guidance when commit failed (expected by tests)
      if (message === 'Commit failed.') {
        message =
          'Commit failed. Please check your commit message format and ensure GPG is set up if commit signing is enabled.';
      }

      core.setFailed(
        `Action failed: ${message}. Please review the logs for more details.`
      );
    }
  }
}
