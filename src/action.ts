/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
