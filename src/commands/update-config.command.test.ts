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

import { UpdateConfigCommand } from './update-config.command';
import type { IGit } from '../types';

jest.mock('@actions/core');

describe('UpdateConfigCommand', () => {
  let mockGit: jest.Mocked<IGit>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockGit = {
      stageChanges: jest.fn(),
      checkoutBranch: jest.fn(),
      commitChanges: jest.fn(),
      fetchLatest: jest.fn(),
      pushChanges: jest.fn(),
      updateConfig: jest.fn()
    } as jest.Mocked<IGit>;
  });

  it('should execute update config command', async () => {
    const command = new UpdateConfigCommand(
      mockGit,
      'John Doe',
      'john@example.com',
      false
    );

    await command.execute();

    expect(core.info).toHaveBeenCalledWith('Updating config...');
    expect(mockGit.updateConfig).toHaveBeenCalledWith(
      'John Doe',
      'john@example.com',
      false
    );
  });

  it('should execute update config command with signing enabled', async () => {
    const command = new UpdateConfigCommand(
      mockGit,
      'Jane Doe',
      'jane@example.com',
      true
    );

    await command.execute();

    expect(core.info).toHaveBeenCalledWith('Updating config...');
    expect(mockGit.updateConfig).toHaveBeenCalledWith(
      'Jane Doe',
      'jane@example.com',
      true
    );
  });
});
