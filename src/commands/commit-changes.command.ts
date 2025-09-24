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

import { NoChangesError } from '../errors';

import type { ICommand, IGit } from '../types';

/**
 * Command to commit changes to the repository.
 */
export class CommitChangesCommand implements ICommand {
  constructor(
    private readonly git: IGit,
    private readonly commitMessage: string,
    private readonly signCommit: boolean
  ) {}

  /**
   * Executes the command to commit changes.
   * Throws NoChangesError if there are no changes to commit.
   */
  async execute(): Promise<void> {
    core.info('Committing changes...');
    const exitCode = await this.git.commitChanges(
      this.commitMessage,
      this.signCommit
    );
    if (exitCode === 1) {
      core.info('No changes to commit. Skipping push and pull request.');
      throw new NoChangesError();
    } else if (exitCode !== 0) {
      throw new Error('Commit failed.');
    }
  }
}
