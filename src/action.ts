import * as core from '@actions/core';

export class Action {
  async run(): Promise<void> {
    core.info('Action executed successfully');
  }
}
