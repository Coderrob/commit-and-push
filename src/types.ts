export enum Input {}

export enum Command {
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

export interface ICommand {
  command: Command;
  args?: string[];
}

export const DISALLOWED_PATTERNS = [
  /\.\./g, // Prevent directory traversal
  /[\r]/g, // Prevent multi-line injection
  /[\n]/g, // Prevent multi-line injection
  /[;&|]/g, // Prevent command chaining
  /`/g, // Prevent command substitution
  /\$/g // Prevent variable interpolation
];

export const ALLOWED_COMMANDS = new Set([
  Command.ADD,
  Command.BRANCH,
  Command.CHECKOUT,
  Command.CLONE,
  Command.COMMIT,
  Command.CONFIG,
  Command.FETCH,
  Command.MERGE,
  Command.PULL,
  Command.PUSH,
  Command.RESET,
  Command.REV_PARSE,
  Command.STATUS,
  Command.TAG
]);
