/*
 *
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

import { run } from './action.js';

const REQUIRED_INPUT = Object.freeze({ required: true });

(async () => {
  await run({
    authorEmail: core.getInput('author_email'),
    authorName: core.getInput('author_name'),
    branch: core.getInput('branch'),
    commitMessage: core.getInput('commit_message', REQUIRED_INPUT),
    directoryPath: core.getInput('directory_path'),
    forcePush: core.getBooleanInput('force_push'),
    remoteRef: core.getInput('remote_ref'),
    signCommit: core.getBooleanInput('sign_commit')
  });
})();
