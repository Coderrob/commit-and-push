/**
 * Error thrown when there are no changes to commit.
 */

export class NoChangesError extends Error {
  constructor() {
    super('No changes to commit');
    this.name = 'NoChangesError';
  }
}
