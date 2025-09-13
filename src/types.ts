/* Single canonical type definitions for the project.
 * Order: constants -> enums -> types -> interfaces */

/* Constants (no enum deps) */

export const DISALLOWED_PATTERNS: Readonly<RegExp[]> = Object.freeze([
  /\.\./,
  /[\r\n]/,
  /[;&|]/,
  /`/,
  /\$/
]);

/* Enums */

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

export enum Quote {
  SINGLE = "'",
  DOUBLE = '"'
}

/* Constants (enum-dependent) */

export const ALLOWED_COMMANDS: Readonly<GitCommand[]> = Object.freeze([
  GitCommand.ADD,
  GitCommand.BRANCH,
  GitCommand.CHECKOUT,
  GitCommand.CLONE,
  GitCommand.CONFIG,
  GitCommand.COMMIT,
  GitCommand.FETCH,
  GitCommand.MERGE,
  GitCommand.PULL,
  GitCommand.PUSH,
  GitCommand.RESET,
  GitCommand.REV_PARSE,
  GitCommand.STATUS,
  GitCommand.TAG
]);

/* Types */

export type InputEntry = IEntry<Input>;

/* Interfaces */

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

export interface IEntry<T> {
  id: T;
  default: string;
  deprecationMessage: string;
  description: string;
  required: boolean;
  value?: string;
}

export interface IExecute {
  execute(): Promise<void>;
}

export interface ICommand {
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

export interface IGitHubClient {
  createPullRequest(
    fromBranch: string,
    toBranch: string,
    title?: string,
    body?: string
  ): Promise<void>;
}

export interface IGitCommand {
  command: GitCommand;
  args?: string[];
}

/* End of file */
