# TODO.md - Commit and Push GitHub Action Repository Improvements

## Overview

This TODO list outlines the tasks to address edge cases, enhance devops
observability, improve the release.sh script, and update documentation based on
the repository review. Tasks are prioritized by impact and urgency.

## High Priority Tasks (Critical Fixes - Address First)

## Medium Priority Tasks (Robustness Improvements)

## Low Priority Tasks (Enhancements and Polish)

### 9. Enhance DevOps Observability in Release.sh

**Requirement**: Add structured logging and timestamps.

- **Details**: Use JSON logs, add timestamps, include step durations.
- **Acceptance Criteria**:
  - Logs are parseable by monitoring tools.
  - Add `--verbose` flag for detailed output.
- **Files to Modify**: `script/release.sh`
- **Estimated Effort**: Medium

### 11. Add Commit Message Validation

**Requirement**: Ensure commit message is non-empty and valid.

- **Details**: Validate in `src/utils/git.ts` before committing.
- **Acceptance Criteria**:
  - Throw error for empty messages.
  - Sanitize for special characters.
- **Files to Modify**: `src/utils/git.ts`
- **Estimated Effort**: Low

### 12. Add Branch Existence Check

**Requirement**: Validate branch before checkout if not creating.

- **Details**: Check remote branch existence in `src/utils/git.ts`.
- **Acceptance Criteria**:
  - Informative error if branch missing and create-branch=false.
- **Files to Modify**: `src/utils/git.ts`
- **Estimated Effort**: Low

### 13. Enhance Logging in Action Code

**Requirement**: Add more detailed logs for better observability.

- **Details**: Include execution times, step statuses in `src/action.ts`.
- **Acceptance Criteria**:
  - Logs follow structured format.
  - Include commit hash in success logs.
- **Files to Modify**: `src/action.ts`
- **Estimated Effort**: Low

### 14. Add GPG Signing Validation

**Requirement**: Check GPG setup before attempting signed commits.

- **Details**: Validate in `src/utils/git.ts` if sign-commit=true.
- **Acceptance Criteria**:
  - Warn or error if GPG not available.
- **Files to Modify**: `src/utils/git.ts`
- **Estimated Effort**: Low

## Coverage Improvement Tasks

### Coverage Overview

Improve code coverage to ensure excellent test coverage across the repository.
Current overall coverage: 89.65% statements, 79.16% functions, 65.77% branches,
88.99% lines.

### High Priority Coverage Tasks (Critical Gaps)

#### 1. Cover Main Entry Point (src/index.ts)

**Requirement**: Add test for the main IIFE function.

- **Details**: The immediately invoked function expression (IIFE) at line 22 is
  uncovered.
- **Acceptance Criteria**:
  - Test that the main function executes without errors.
  - Mock inputs and Action execution.
- **Files to Modify**: `src/index.test.ts` (create new)
- **Estimated Effort**: Low

#### 2. Cover Input Proxy Handler (src/inputs.ts)

**Requirement**: Add test for the Proxy get function.

- **Details**: The get handler in the Proxy at line 128 is uncovered.
- **Acceptance Criteria**:
  - Test valid input keys return values.
  - Test invalid input keys throw InvalidInputKeyError.
- **Files to Modify**: `src/inputs.test.ts` (create new)
- **Estimated Effort**: Low

#### 3. Cover Error Classes Branches (src/errors/)

**Requirement**: Add tests for uncovered branches in error constructors.

- **Details**:
  - `InvalidInputKeyError`: Test constructor with key parameter.
  - `DirectoryNotFoundError`: Test constructor with path parameter.
  - `GitCommandFailedError`: Test constructor with message parameter.
  - `PullRequestCreationError`: Test constructor with message parameter.
  - `UnauthorizedCommandError`: Test constructor with command parameter.
  - `SecurityError`: Test constructor with custom message.
  - `InvalidRepositoryFormatError`: Test constructor with custom message.
  - `InvalidInputError`: Test constructor with custom message.
  - `NoChangesError`: Test constructor.
- **Acceptance Criteria**:
  - All branches in error constructors covered.
- **Files to Modify**: `src/errors/*.test.ts` (create new or update existing)
- **Estimated Effort**: Medium

#### 4. Cover GitHub Client (src/services/github/github-client.ts)

**Requirement**: Add test for createPullRequest method.

- **Details**: The createPullRequest method is uncovered.
- **Acceptance Criteria**:
  - Test that it delegates to PullRequestService.
- **Files to Modify**: `src/services/github/github-client.test.ts` (create new)
- **Estimated Effort**: Low

#### 5. Cover GitHub Service Exports (src/services/github/index.ts)

**Requirement**: Add test for export statements.

- **Details**: The export statements are uncovered.
- **Acceptance Criteria**:
  - Test that exports are accessible.
- **Files to Modify**: `src/services/github/index.test.ts` (create new)
- **Estimated Effort**: Low

#### 6. Cover Pull Request Service Branches (src/services/github/pull-request-service.ts)

**Requirement**: Add tests for uncovered branches in createPullRequest.

- **Details**: The createPullRequest method has uncovered branches (e.g., error
  handling).
- **Acceptance Criteria**:
  - Test error paths in createPullRequest.
- **Files to Modify**: `src/services/github/pull-request-service.test.ts`
  (update existing)
- **Estimated Effort**: Low

#### 7. Cover Utils Exports (src/utils/index.ts)

**Requirement**: Add test for export statements.

- **Details**: The export statements are uncovered.
- **Acceptance Criteria**:
  - Test that exports are accessible.
- **Files to Modify**: `src/utils/index.test.ts` (create new)
- **Estimated Effort**: Low

#### 8. Cover VCS Git Methods (src/vcs/git.ts)

**Requirement**: Add tests for uncovered methods or branches.

- **Details**: Methods like updateConfig, fetchLatest, etc., have uncovered
  branches.
- **Acceptance Criteria**:
  - Test all branches in Git methods.
- **Files to Modify**: `src/vcs/git.test.ts` (update existing)
- **Estimated Effort**: Medium

#### 9. Cover VCS Common Branches (src/vcs/common.ts)

**Requirement**: Add tests for uncovered branches in GitCommandExecutor.

- **Details**: One function has uncovered branches (likely sanitizeInput or
  execCommand).
- **Acceptance Criteria**:
  - Test all branches in GitCommandExecutor methods.
- **Files to Modify**: `src/vcs/common.test.ts` (update existing)
- **Estimated Effort**: Low

### Coverage Goals

- Target: 95% statements, 90% functions, 80% branches, 95% lines.
- Ensure all new code is covered.
- Run coverage after each task to verify improvement.

### Task Dependencies

- Coverage tasks can be done independently.
- Update jest.config.mjs thresholds after reaching goals.

### Completion Criteria

- All coverage tasks completed.
- Coverage meets or exceeds targets.
- No regressions in existing tests.
