export class GitCommandFailedError extends Error {
  constructor(message?: string) {
    super(message ? `Git command failed: ${message}` : 'Git command failed');
    this.name = 'GitCommandFailedError';
  }
}
