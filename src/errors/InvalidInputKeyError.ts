export class InvalidInputKeyError extends Error {
  constructor(key?: string) {
    super(key ? `Invalid input key: ${key}` : 'Invalid input key');
    this.name = 'InvalidInputKeyError';
  }
}
