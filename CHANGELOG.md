# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CHANGELOG.md for tracking changes

### Changed

- **Release Script Version Comparison**: Enhanced `script/release.sh` with
  SemVer comparison function to prevent creating tags that are not greater than
  the latest tag, avoiding downgrades and duplicates.
- **Release Script Non-Interactive Mode**: Added support for `RELEASE_TAG` and
  `SKIP_CONFIRMATION` environment variables in `script/release.sh` to enable
  CI/CD usage without user prompts.
- **Error Messages**: Improved error messages across the codebase in
  `src/action.ts` and `src/utils/git.ts` to be more user-friendly and
  actionable, providing guidance on potential fixes.
- **Readme Examples**: Updated `README.md` with real example usage instead of
  placeholders, making it copypaste ready.

### Fixed

- **Commit Failure Handling**: Modified `src/utils/git.ts` and `src/action.ts`
  to properly distinguish between "no changes to commit" and other commit
  errors. The action now skips push and PR when no changes are detected, and
  throws an error for other commit failures. Added unit tests for both
  scenarios.
- **Repository Format Validation**: Added validation in `src/action.ts`
  constructor to ensure repository input is in `owner/repo` format. Throws
  descriptive error for invalid formats. Added unit tests for invalid cases.
- **Pull Request Creation Validation**: Added check in
  `src/utils/github-client.ts` to skip PR creation if `fromBranch` equals
  `toBranch`. Logs a warning message. Added unit tests for both scenarios.
- **GitHub Token Required Flag**: Updated `action.yml` to set `github-token` as
  `required: true` to align with `src/inputs.ts`.
- **Directory Path Validation**: Added check in `src/utils/git.ts` to validate
  directory existence before staging changes. Throws error if directory does not
  exist. Added unit tests.

### Removed

### Security
