export enum Input {
  GITHUB_TOKEN = 'github_token',
  GITHUB_HOSTNAME = 'github_hostname',
  COMMIT_MESSAGE = 'commit_message',
  FORCE_PUSH = 'force_push',
  TARGET_BRANCH = 'target_branch',
  DIRECTORY_PATH = 'directory_path',
  REMOTE_REF = 'remote_ref',
  SIGN_COMMIT = 'sign_commit',
  AUTHOR_NAME = 'author_name',
  AUTHOR_EMAIL = 'author_email'
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

export interface ICommitAndPush {
  updateConfig(): Promise<number>;
  fetchLatest(): Promise<number>;
  checkoutBranch(): Promise<number>;
  stageChanges(): Promise<number>;
  commitChanges(): Promise<number>;
  pushChanges(): Promise<number>;
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
