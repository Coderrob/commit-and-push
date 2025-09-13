import * as fs from 'fs';
/*
 * Migrated Git implementation to src/vcs
 */
import * as core from '@actions/core';
import { GitCommand, Output } from '../types';
import { isError } from '../utils/guards';
import { GitCommandExecutor } from './common.js';
const { ADD, CHECKOUT, COMMIT, CONFIG, FETCH, PUSH, REV_PARSE } = GitCommand;
export class Git {
    async updateConfig(userName, userEmail, signCommit = false) {
        await GitCommandExecutor.execCommand({
            command: CONFIG,
            args: ['--global', 'user.name', GitCommandExecutor.ensureQuoted(userName)]
        });
        await GitCommandExecutor.execCommand({
            command: CONFIG,
            args: [
                '--global',
                'user.email',
                GitCommandExecutor.ensureQuoted(userEmail)
            ]
        });
        if (signCommit) {
            await GitCommandExecutor.execCommand({
                command: CONFIG,
                args: ['--global', 'commit.gpgsign', signCommit.toString()]
            });
        }
        return core.ExitCode.Success;
    }
    async fetchLatest() {
        const { exitCode } = await GitCommandExecutor.execCommand({
            command: FETCH,
            args: ['--all']
        });
        return exitCode;
    }
    async checkoutBranch(branch, createNew = false) {
        const { exitCode } = await GitCommandExecutor.execCommand({
            command: CHECKOUT,
            args: createNew ? ['-b', branch] : [branch]
        });
        return exitCode;
    }
    async stageChanges(directoryPath) {
        if (!fs.existsSync(directoryPath)) {
            throw new Error(`Directory path '${directoryPath}' does not exist.`);
        }
        const { exitCode } = await GitCommandExecutor.execCommand({
            command: ADD,
            args: [GitCommandExecutor.ensureQuoted(directoryPath)]
        });
        return exitCode;
    }
    async commitChanges(message, signCommit = false) {
        try {
            const { exitCode } = await GitCommandExecutor.execCommand({
                command: COMMIT,
                args: signCommit
                    ? ['-S', '-m', GitCommandExecutor.ensureQuoted(message)]
                    : ['-m', GitCommandExecutor.ensureQuoted(message)]
            });
            return exitCode;
        }
        catch (error) {
            const errMessage = isError(error) ? error.message : String(error);
            if (errMessage.includes('nothing to commit')) {
                core.info(`No changes detected. Skipping commit. ${errMessage}`);
                return 1;
            }
            else {
                core.error(`Commit failed: ${errMessage}`);
                return 2;
            }
        }
    }
    async pushChanges(remote, branch, force = false) {
        const pushExecResult = await GitCommandExecutor.execCommand({
            command: PUSH,
            args: force ? [remote, branch, '--force'] : [remote, branch]
        });
        if (!GitCommandExecutor.isExecOutputSuccess(pushExecResult)) {
            return core.ExitCode.Failure;
        }
        const getCommitHashResult = await GitCommandExecutor.execCommand({
            command: REV_PARSE,
            args: ['HEAD']
        });
        if (!GitCommandExecutor.isExecOutputSuccess(getCommitHashResult)) {
            const message = `Failed to get commit hash: ${getCommitHashResult.stderr}`;
            throw new Error(message);
        }
        core.setOutput(Output.COMMIT_HASH, getCommitHashResult.stdout);
        return core.ExitCode.Success;
    }
}
//# sourceMappingURL=git.js.map