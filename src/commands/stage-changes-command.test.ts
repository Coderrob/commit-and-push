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

import { StageChangesCommand } from './stage-changes-command';
import type { IGit } from '../types';

jest.mock('@actions/core');

describe('StageChangesCommand', () => {
  let mockGit: jest.Mocked<IGit>;

  beforeEach(() => {
    mockGit = {
      stageChanges: jest.fn(),
      checkoutBranch: jest.fn(),
      commitChanges: jest.fn(),
      fetchLatest: jest.fn(),
      pushChanges: jest.fn(),
      updateConfig: jest.fn()
    } as jest.Mocked<IGit>;
    jest.clearAllMocks();
  });

  it('should execute stage changes command', async () => {
    const command = new StageChangesCommand(mockGit, '.');

    await command.execute();

    expect(core.info).toHaveBeenCalledWith('Staging changes...');
    expect(mockGit.stageChanges).toHaveBeenCalledWith('.');
  });

  it('should execute stage changes command with specific directory', async () => {
    const command = new StageChangesCommand(mockGit, 'src');

    await command.execute();

    expect(core.info).toHaveBeenCalledWith('Staging changes...');
    expect(mockGit.stageChanges).toHaveBeenCalledWith('src');
  });
});
