export class InvalidInputError extends Error {
  constructor(message = 'Invalid input type') {
    super(message);
    this.name = 'InvalidInputError';
  }
}
