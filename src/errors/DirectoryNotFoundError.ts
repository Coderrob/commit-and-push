export class DirectoryNotFoundError extends Error {
  constructor(path?: string) {
    super(
      path
        ? `Directory path '${path}' does not exist.`
        : 'Directory path does not exist.'
    );
    this.name = 'DirectoryNotFoundError';
  }
}
