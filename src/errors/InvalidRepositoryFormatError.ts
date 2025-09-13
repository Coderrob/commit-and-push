export class InvalidRepositoryFormatError extends Error {
  constructor(
    message = 'Invalid repository format. Expected format: owner/repo'
  ) {
    super(message);
    this.name = 'InvalidRepositoryFormatError';
  }
}
