import * as core from '@actions/core';
import { isError } from './utils/guards.js';
import { ICommitAndPush, IExecute } from './types.js';
import { BaseAction } from './utils/base-action.js';

export class Action extends BaseAction implements ICommitAndPush, IExecute {
  public async execute(): Promise<void> {
    return this.updateConfig()
      .then(() => this.fetchLatest())
      .then(() => this.checkoutBranch())
      .then(() => this.stageChanges())
      .then(() => this.commitChanges())
      .then(() => this.pushChanges())
      .then(() => core.info('Changes pushed successfully!'))
      .catch((error) => {
        const message = isError(error) ? error.message : String(error);
        core.setFailed(message);
      });
  }
}
