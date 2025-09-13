export class UnauthorizedCommandError extends Error {
  constructor(command?: string) {
    super(
      command
        ? `Unauthorized Git command: ${command}`
        : 'Unauthorized Git command'
    );
    this.name = 'UnauthorizedCommandError';
  }
}
