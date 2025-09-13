export class SecurityError extends Error {
  constructor(message = 'Security risk detected') {
    super(message);
    this.name = 'SecurityError';
  }
}
