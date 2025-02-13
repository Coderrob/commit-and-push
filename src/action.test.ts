import * as core from '@actions/core';
import { Action } from './action.js';

describe('Action', () => {
  it('should run successfully', async () => {
    await new Action().run();
    expect(core.info).toHaveBeenCalledTimes(1);
    expect(core.info).toHaveBeenNthCalledWith(
      1,
      'Action executed successfully'
    );
  });
});
