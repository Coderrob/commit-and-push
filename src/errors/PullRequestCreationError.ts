export class PullRequestCreationError extends Error {
  constructor(message?: string) {
    super(
      message
        ? `Pull request creation failed: ${message}`
        : 'Pull request creation failed'
    );
    this.name = 'PullRequestCreationError';
  }
}
