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

export enum Input {
  AUTHOR_EMAIL = 'author-email',
  AUTHOR_NAME = 'author-name',
  BRANCH = 'branch',
  COMMIT_MESSAGE = 'commit-message',
  CREATE_BRANCH = 'create-branch',
  DIRECTORY_PATH = 'directory-path',
  FETCH_LATEST = 'fetch-latest',
  FORCE_PUSH = 'force-push',
  GITHUB_HOSTNAME = 'github-hostname',
  GITHUB_TOKEN = 'github-token',
  OPEN_PULL_REQUEST = 'open-pull-request',
  REMOTE_REF = 'remote-ref',
  REPOSITORY = 'repository',
  SIGN_COMMIT = 'sign-commit'
}

export enum Output {
  COMMIT_HASH = 'commit-hash'
}

export interface GitHubParams {
  readonly baseUrl: string;
  readonly token: string;
  readonly owner: string;
  readonly repo: string;
}

export interface GitWorkflowParams {
  readonly authorEmail: string;
  readonly authorName: string;
  readonly branch: string;
  readonly commitMessage: string;
  readonly createBranch: boolean;
  readonly directoryPath: string;
  readonly fetchLatest: boolean;
  readonly forcePush: boolean;
  readonly githubToken: string;
  readonly openPullRequest: boolean;
  readonly remoteRef: string;
  readonly repository: string;
  readonly signCommit: boolean;
}

export enum GitCommand {
  ADD = 'add',
  BRANCH = 'branch',
  CHECKOUT = 'checkout',
  CLONE = 'clone',
  CONFIG = 'config',
  COMMIT = 'commit',
  FETCH = 'fetch',
  MERGE = 'merge',
  PULL = 'pull',
  PUSH = 'push',
  RESET = 'reset',
  REV_PARSE = 'rev-parse',
  STATUS = 'status',
  TAG = 'tag'
}

export type InputEntry = IEntry<Input>;

/**
 *  InputEntry interface definition
 */
export interface IEntry<T> {
  id: T;
  default: string;
  deprecationMessage: string;
  description: string;
  required: boolean;
  value?: string;
}

/**
 * Command interface definition
 */
export interface ICommand {
  command: GitCommand;
  args?: string[];
}

/**
 * Execute interface definition
 */
export interface IExecute {
  execute(): Promise<void>;
}

export interface IGit {
  updateConfig(
    userName: string,
    userEmail: string,
    signCommit?: boolean
  ): Promise<number>;
  fetchLatest(): Promise<number>;
  checkoutBranch(branch: string, createNew?: boolean): Promise<number>;
  stageChanges(directoryPath: string): Promise<number>;
  commitChanges(message: string, signCommit?: boolean): Promise<number>;
  pushChanges(remote: string, branch: string, force?: boolean): Promise<number>;
}

/**
 * Disallowed patterns for input validation
 * @type {RegExp[]}
 * @constant {RegExp[]} DISALLOWED_PATTERNS
 */
export const DISALLOWED_PATTERNS: Readonly<RegExp[]> = Object.freeze([
  /\.\./g, // Prevent directory traversal
  /[\r]/g, // Prevent multi-line injection
  /[\n]/g, // Prevent multi-line injection
  /[;&|]/g, // Prevent command chaining
  /`/g, // Prevent command substitution
  /\$/g // Prevent variable interpolation
]);

/**
 * Allowed commands for input validation
 * @type {Set<GitCommand>} ALLOWED_COMMANDS
 * @constant {Set<Command>} ALLOWED_COMMANDS
 */
export const ALLOWED_COMMANDS: Readonly<GitCommand[]> = Object.freeze(
  Array.from(
    new Set([
      GitCommand.ADD,
      GitCommand.BRANCH,
      GitCommand.CHECKOUT,
      GitCommand.CLONE,
      GitCommand.COMMIT,
      GitCommand.CONFIG,
      GitCommand.FETCH,
      GitCommand.MERGE,
      GitCommand.PULL,
      GitCommand.PUSH,
      GitCommand.RESET,
      GitCommand.REV_PARSE,
      GitCommand.STATUS,
      GitCommand.TAG
    ])
  )
);
