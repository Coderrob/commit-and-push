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

import { Input, InputEntry } from './types.js';

export const actionInputs: Record<Input, InputEntry> = {
  [Input.AUTHOR_EMAIL]: {
    id: Input.AUTHOR_EMAIL,
    default: 'github-actions@noreply.github.com',
    deprecationMessage: '',
    description: 'The author email to use for the commit',
    required: false
  },
  [Input.AUTHOR_NAME]: {
    id: Input.AUTHOR_NAME,
    description: 'The author name to use for the commit',
    default: 'GitHub Actions',
    required: false,
    deprecationMessage: ''
  },
  [Input.BRANCH]: {
    id: Input.BRANCH,
    description: 'The branch target to push the commit to',
    default: '${{ github.ref_name }}',
    required: false,
    deprecationMessage: ''
  },
  [Input.COMMIT_MESSAGE]: {
    id: Input.COMMIT_MESSAGE,
    description: 'The commit message to use for the commit',
    default: 'Automated commit-and-push by GitHub Actions',
    required: false,
    deprecationMessage: ''
  },
  [Input.CREATE_BRANCH]: {
    id: Input.CREATE_BRANCH,
    description: 'Whether to create the branch if it is missing',
    default: 'false',
    required: false,
    deprecationMessage: ''
  },
  [Input.DIRECTORY_PATH]: {
    id: Input.DIRECTORY_PATH,
    description: 'The directory path to use for adding changes to the commit',
    default: '.',
    required: false,
    deprecationMessage: ''
  },
  [Input.FETCH_LATEST]: {
    id: Input.FETCH_LATEST,
    description:
      'Whether to fetch the latest changes from the remote repository before pushing the commit',
    default: 'false',
    required: false,
    deprecationMessage: ''
  },
  [Input.FORCE_PUSH]: {
    id: Input.FORCE_PUSH,
    description: 'Whether to force push the commit',
    default: 'false',
    required: false,
    deprecationMessage: ''
  },
  [Input.GITHUB_HOSTNAME]: {
    id: Input.GITHUB_HOSTNAME,
    description:
      'The GitHub hostname to use for access (for GitHub Enterprise <3)',
    default: 'github.com',
    required: false,
    deprecationMessage: ''
  },
  [Input.GITHUB_TOKEN]: {
    id: Input.GITHUB_TOKEN,
    description: 'The GitHub token to use for authentication',
    default: '${{ github.token }}',
    required: true,
    deprecationMessage: ''
  },
  [Input.OPEN_PULL_REQUEST]: {
    id: Input.OPEN_PULL_REQUEST,
    description: 'Whether to open a pull request after pushing the commit',
    default: 'false',
    required: false,
    deprecationMessage: ''
  },
  [Input.REPOSITORY]: {
    id: Input.REPOSITORY,
    description: 'The GitHub repository to use for the commit',
    default: '${{ github.repository }}',
    required: false,
    deprecationMessage: ''
  },
  [Input.REMOTE_REF]: {
    id: Input.REMOTE_REF,
    description: 'The remote reference to use for the commit',
    default: 'origin',
    required: false,
    deprecationMessage: ''
  },
  [Input.SIGN_COMMIT]: {
    id: Input.SIGN_COMMIT,
    description: 'Whether to sign the commit',
    default: 'false',
    required: false,
    deprecationMessage: ''
  }
};

export const getInputValue = new Proxy({} as Record<Input, string>, {
  get: (_, key: string) => {
    if (!Object.values(Input).includes(key as Input)) {
      throw new Error(`Invalid input key: ${key}`);
    }
    const entry = actionInputs[key as Input];
    const value = core.getInput(entry.id, { required: entry.required });
    return value || entry.default;
  }
});
