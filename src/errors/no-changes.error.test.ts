import { NoChangesError } from './no-changes.error';

describe('NoChangesError', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be an instance of Error', () => {
    const error = new NoChangesError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should be an instance of NoChangesError', () => {
    const error = new NoChangesError();
    expect(error).toBeInstanceOf(NoChangesError);
  });

  it('should have the correct message', () => {
    const error = new NoChangesError();
    expect(error.message).toBe('No changes to commit');
  });

  it('should have the correct name', () => {
    const error = new NoChangesError();
    expect(error.name).toBe('NoChangesError');
  });
});
