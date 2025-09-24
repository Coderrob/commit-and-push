# Commit and Push Changes

[![CI](https://github.com/Coderrob/commit-and-push/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Coderrob/commit-and-push/actions/workflows/ci.yml)
[![Check dist](https://github.com/Coderrob/commit-and-push/actions/workflows/check-dist.yml/badge.svg?branch=main)](https://github.com/Coderrob/commit-and-push/actions/workflows/check-dist.yml)
[![Coverage](https://github.com/Coderrob/commit-and-push/raw/main/badges/coverage.svg)](https://github.com/Coderrob/commit-and-push/raw/main/badges/coverage.svg)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Node >=20](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)

This action automates committing and pushing code changes to a GitHub
repository. It ensures updates are regularly applied without manual intervention
while following security best practices.

## Branding

| Attribute | Value      |
| --------- | ---------- |
| Color     | blue       |
| Icon      | git-commit |

## Inputs

| Name               | Description                                                 | Default                                         | Required | Deprecation |
| ------------------ | ----------------------------------------------------------- | ----------------------------------------------- | -------- | ----------- |
| github-hostname    | GitHub hostname to support GitHub Enterprise installations. | github.com                                      | ❌ No    | -           |
| github-token       | GitHub token used for authentication                        | ${{ github.token }}                             | ✅ Yes   | -           |
| repository         | GitHub repository in the format owner/repository            | ${{ github.repository }}                        | ❌ No    | -           |
| remote-ref         | Remote repository reference                                 | origin                                          | ❌ No    | -           |
| fetch-latest       | Whether to fetch latest before committing changes           | false                                           | ❌ No    | -           |
| branch             | Name of the branch to push the code into                    | ${{ github.ref_name }}                          | ❌ No    | -           |
| create-branch      | Create branch if it does not exist                          | false                                           | ❌ No    | -           |
| directory-path     | Path to the directory containing files to commit and push   | .                                               | ❌ No    | -           |
| author-name        | Name of the commit author                                   | GitHub Actions                                  | ❌ No    | -           |
| author-email       | Email of the commit author                                  | <github-actions@noreply.github.com>             | ❌ No    | -           |
| sign-commit        | Whether to sign commits using GPG (true/false)              | false                                           | ❌ No    | -           |
| commit-message     | Commit message for the changes                              | Automated commit-and-push by GitHub Actions     | ❌ No    | -           |
| force-push         | Whether to force push (true/false)                          | false                                           | ❌ No    | -           |
| open-pull-request  | Whether to open pull request (true/false)                   | false                                           | ❌ No    | -           |
| pull-request-title | Title of the pull request when open-pull-request is true    | Automated Pull Request                          | ❌ No    | -           |
| pull-request-body  | Body of the pull request when open-pull-request is true.    | Automated pull request created by {author-name} | ❌ No    | -           |

## Outputs

| Name                | Description                                                                      | Value |
| ------------------- | -------------------------------------------------------------------------------- | ----- |
| commit-hash         | The hash of the latest commit                                                    |       |
| pull-request-number | The number of the created pull request (only set when open-pull-request is true) |       |
| pull-request-url    | The URL of the created pull request (only set when open-pull-request is true)    |       |

## Environment Variables

This action does not require any environment variables.

## Dependencies

This section provides a graph of dependencies relevant to this action.

    dependencies:
    - GitHub Actions Runner
    - Specific environment variables
    - Required files and configurations

## Runs

**Execution Type:** node20

This action uses a Node.js runtime configuration.

## Example Usage

    jobs:
      example:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v2
          - name: Run Commit and Push Changes
            uses: ./
            with:
              github-token: ${{ github.token }}
              repository: ${{ github.repository }}
              branch: main
              directory-path: .
              author-name: GitHub Actions
              author-email: github-actions@noreply.github.com
              commit-message: Automated commit-and-push by GitHub Actions

## Acknowledgments

This project leverages Markdown generation techniques from
[coderrob.com](https://coderrob.com), developed by **Robert Lindley**.
