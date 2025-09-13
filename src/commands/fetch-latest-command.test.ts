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

import type { IGit } from '../types';
import * as core from '@actions/core';

import { FetchLatestCommand } from './fetch-latest-command';

describe('FetchLatestCommand', () => {
  let gitMock: jest.Mocked<IGit>;
  let infoSpy: jest.SpyInstance;

  beforeEach(() => {
    gitMock = {
      fetchLatest: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<IGit>;
    infoSpy = jest.spyOn(core, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls core.info with "Fetching latest..."', async () => {
    await new FetchLatestCommand(gitMock).execute();
    expect(infoSpy).toHaveBeenCalledWith('Fetching latest...');
  });

  it('calls git.fetchLatest', async () => {
    await new FetchLatestCommand(gitMock).execute();
    expect(gitMock.fetchLatest).toHaveBeenCalledTimes(1);
  });

  it('propagates errors from git.fetchLatest', async () => {
    const error = new Error('fetch failed');
    gitMock.fetchLatest.mockRejectedValueOnce(error);
    await expect(new FetchLatestCommand(gitMock).execute()).rejects.toThrow(
      error
    );
  });
});
