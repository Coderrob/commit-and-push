import * as core from '@actions/core';
import { ExitCode } from '@actions/core';
import { GitCommand, ICommitAndPush, Input } from '../types.js';
import { execCommand, isExecOutputSuccess } from './git.js';
import { isTrue } from './guards.js';

const { ADD, CONFIG, FETCH, CHECKOUT, COMMIT, PUSH, REV_PARSE } = GitCommand;

export abstract class BaseAction implements ICommitAndPush {
  private readonly authorEmail: string;
  private readonly authorName: string;
  private readonly branch: string;
  private readonly commitMessage: string;
  private readonly directoryPath: string;
  private readonly forcePush: boolean;
  private readonly remoteRef: string;
  private readonly signCommit: boolean;

  constructor({
    [Input.AUTHOR_EMAIL]: authorEmail,
    [Input.AUTHOR_NAME]: authorName,
    [Input.COMMIT_MESSAGE]: commitMessage,
    [Input.DIRECTORY_PATH]: directoryPath,
    [Input.FORCE_PUSH]: forcePush,
    [Input.REMOTE_REF]: remoteRef,
    [Input.SIGN_COMMIT]: signCommit,
    [Input.TARGET_BRANCH]: branch
  }: Record<Input, string>) {
    this.authorEmail = authorEmail;
    this.authorName = authorName;
    this.branch = branch;
    this.commitMessage = commitMessage;
    this.directoryPath = directoryPath;
    this.forcePush = isTrue(forcePush);
    this.remoteRef = remoteRef;
    this.signCommit = isTrue(signCommit);
  }

  async updateConfig(): Promise<number> {
    // Set the required global git user name
    await execCommand({
      command: CONFIG,
      args: ['--global', 'user.name', this.authorName]
    });
    // Set the required global git user email
    await execCommand({
      command: CONFIG,
      args: ['--global', 'user.email', this.authorEmail]
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
      args: [this.branch]
    });
    return exitCode;
  }

  async stageChanges(): Promise<number> {
    const { exitCode } = await execCommand({
      command: ADD,
      args: [this.directoryPath]
    });
    return exitCode;
  }

  async commitChanges(): Promise<number> {
    try {
      const { exitCode } = await execCommand({
        command: COMMIT,
        args: this.signCommit
          ? ['-S', '-m', this.commitMessage]
          : ['-m', this.commitMessage]
      });
      return exitCode;
    } catch {
      core.info('No changes detected. Skipping commit.');
      return ExitCode.Success;
    }
  }

  async pushChanges(): Promise<number> {
    const pushExecResult = await execCommand({
      command: PUSH,
      args: this.forcePush
        ? ['--force', this.remoteRef, `HEAD:${this.branch}`]
        : [this.remoteRef, `HEAD:${this.branch}`]
    });

    if (!isExecOutputSuccess(pushExecResult)) {
      return ExitCode.Failure;
    }

    const revParseExecResult = await execCommand({
      command: REV_PARSE,
      args: ['HEAD']
    });

    if (!isExecOutputSuccess(revParseExecResult)) {
      const message = `Failed to get commit hash: ${revParseExecResult.stderr}`;
      throw new Error(message);
    }

    core.setOutput('commit_hash', revParseExecResult.stdout);
    return core.ExitCode.Success;
  }
}
