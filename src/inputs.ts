import * as core from '@actions/core';
import { Input, InputEntry } from './types.js';

export const actionInputs: Record<Input, InputEntry> = {
  [Input.AUTHOR_EMAIL]: {
    id: Input.AUTHOR_EMAIL,
    default: 'github-actions@example.com',
    deprecationMessage: '',
    description: 'The author email to use for the commit',
    required: false
  },
  [Input.AUTHOR_NAME]: {
    id: Input.AUTHOR_NAME,
    description: 'The author name to use for the commit',
    default: 'commit-and-push',
    required: false,
    deprecationMessage: ''
  },
  [Input.BRANCH_TARGET]: {
    id: Input.BRANCH_TARGET,
    description: 'The branch target to push the commit to',
    default: 'main',
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
    description: 'The directory path to use for the commit',
    default: '.',
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
    default: 'github-token',
    required: true,
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
