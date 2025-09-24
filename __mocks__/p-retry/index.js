// Manual mock for p-retry to avoid ES module issues with Jest
const pRetry = jest.fn().mockImplementation(async (fn, options = {}) => {
  // Simple retry simulation for tests
  const retries = options.retries || 3;
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // If this is the last attempt, throw the error
      if (attempt === retries) {
        throw error;
      }

      // Call onFailedAttempt if provided
      if (options.onFailedAttempt) {
        const attemptError = {
          ...error,
          attemptNumber: attempt + 1,
          retriesLeft: retries - attempt
        };
        options.onFailedAttempt(attemptError);
      }
    }
  }

  throw lastError;
});

class AbortError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AbortError';
  }
}

// ES module export
const pRetryModule = {
  __esModule: true,
  default: pRetry,
  AbortError: AbortError
};

module.exports = pRetryModule;
