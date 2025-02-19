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

import { GitWorkflowParams, IExecute, Input } from './types.js';
import { Git } from './utils/git.js';
import { GitHubClient } from './utils/github-client.js';
import { isError, isTrue } from './utils/guards.js';

export class Action implements IExecute {
  private readonly git: Git;
  private readonly gitHub: GitHubClient;
  private readonly params: GitWorkflowParams;

  constructor({
    [Input.AUTHOR_EMAIL]: authorEmail,
    [Input.AUTHOR_NAME]: authorName,
    [Input.BRANCH]: branch,
    [Input.COMMIT_MESSAGE]: commitMessage,
    [Input.CREATE_BRANCH]: createBranch,
    [Input.DIRECTORY_PATH]: directoryPath,
    [Input.FETCH_LATEST]: fetchLatest,
    [Input.FORCE_PUSH]: forcePush,
    [Input.GITHUB_HOSTNAME]: githubHostname,
    [Input.GITHUB_TOKEN]: githubToken,
    [Input.OPEN_PULL_REQUEST]: openPullRequest,
    [Input.REMOTE_REF]: remoteRef,
    [Input.REPOSITORY]: repository,
    [Input.SIGN_COMMIT]: signCommit
  }: Record<Input, string>) {
    const [owner, repo] = repository.split('/');
    this.params = {
      authorEmail,
      authorName,
      branch,
      commitMessage,
      createBranch: isTrue(createBranch),
      directoryPath,
      fetchLatest: isTrue(fetchLatest),
      forcePush: isTrue(forcePush),
      githubToken,
      openPullRequest: isTrue(openPullRequest),
      remoteRef,
      repository,
      signCommit: isTrue(signCommit)
    };
    this.git = new Git();
    this.gitHub = new GitHubClient({
      baseUrl: `https://api.${githubHostname}`,
      token: githubToken,
      owner,
      repo
    });
  }

  async execute(): Promise<void> {
    try {
      core.info('Updating config...');
      await this.git.updateConfig(
        this.params.authorName,
        this.params.authorEmail,
        this.params.signCommit
      );

      if (this.params.fetchLatest) {
        core.info('Fetching latest...');
        await this.git.fetchLatest();
      }

      core.info('Checking out branch...');
      await this.git.checkoutBranch(
        this.params.branch,
        this.params.createBranch
      );

      core.info('Staging changes...');
      await this.git.stageChanges(this.params.directoryPath);

      core.info('Committing changes...');
      await this.git.commitChanges(
        this.params.commitMessage,
        this.params.signCommit
      );

      core.info('Pushing changes...');
      await this.git.pushChanges(
        this.params.remoteRef,
        this.params.branch,
        this.params.forcePush
      );

      if (this.params.openPullRequest) {
        core.info('Opening pull request...');
        await this.gitHub.createPullRequest(
          this.params.branch,
          this.params.branch
        );
      }
    } catch (error) {
      const message = isError(error) ? error.message : 'Unknown error';
      core.setFailed(`Failed to commit changes with error: ${message}`);
    }
  }
}
