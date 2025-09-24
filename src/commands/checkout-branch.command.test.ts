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

import { CheckoutBranchCommand } from './checkout-branch.command';

import type { IGit } from '../types';

describe('CheckoutBranchCommand', () => {
  let mockGit: jest.Mocked<IGit>;

  const createMockGit = (): jest.Mocked<IGit> =>
    ({
      updateConfig: jest.fn<Promise<number>, [string, string, boolean?]>(),
      fetchLatest: jest.fn<Promise<number>, []>(),
      checkoutBranch: jest.fn<Promise<number>, [string, boolean?]>(),
      stageChanges: jest.fn<Promise<number>, [string]>(),
      commitChanges: jest.fn<Promise<number>, [string, boolean?]>(),
      pushChanges: jest.fn<Promise<number>, [string, string, boolean?]>()
    }) as unknown as jest.Mocked<IGit>;

  beforeEach(() => {
    mockGit = createMockGit();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should set git, branch, and createBranch properties', () => {
    const branch = 'feature/test';
    const createBranch = true;

    const command = new CheckoutBranchCommand(mockGit, branch, createBranch);

    // @ts-expect-error: testing private properties
    expect(command.git).toBe(mockGit);
    // @ts-expect-error: testing private properties
    expect(command.branch).toBe(branch);
    // @ts-expect-error: testing private properties
    expect(command.createBranch).toBe(createBranch);
  });

  it('should call core.info and git.checkoutBranch with correct arguments when execute is called', async () => {
    const branch = 'feature/test';
    const createBranch = false;

    mockGit.checkoutBranch.mockResolvedValueOnce(0);

    const command = new CheckoutBranchCommand(mockGit, branch, createBranch);

    const coreInfoSpy = jest.spyOn(core, 'info').mockImplementation(() => {});

    await command.execute();

    expect(coreInfoSpy).toHaveBeenCalledWith('Checking out branch...');
    expect(mockGit.checkoutBranch).toHaveBeenCalledWith(branch, createBranch);
  });

  it('should propagate errors thrown by git.checkoutBranch', async () => {
    const error = new Error('checkout failed');
    mockGit.checkoutBranch.mockRejectedValueOnce(error);

    const command = new CheckoutBranchCommand(mockGit, 'branch', false);

    jest.spyOn(core, 'info').mockImplementation(() => {});

    await expect(command.execute()).rejects.toThrow('checkout failed');
  });
});
