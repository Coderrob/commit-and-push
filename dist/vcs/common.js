/* GitCommandExecutor moved to src/vcs */
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { ALLOWED_COMMANDS, DISALLOWED_PATTERNS, Quote } from '../types';
import { isError, isString } from '../utils/guards';
export class GitCommandExecutor {
    static ensureQuoted(value, quote = Quote.DOUBLE) {
        const length = value.length;
        const hasDoubleQuotes = length > 1 &&
            value.startsWith(Quote.DOUBLE) &&
            value.endsWith(Quote.DOUBLE);
        const hasSingleQuotes = length > 1 &&
            value.startsWith(Quote.SINGLE) &&
            value.endsWith(Quote.SINGLE);
        return hasDoubleQuotes || hasSingleQuotes
            ? value
            : [quote, value, quote].join('');
    }
    static isExecOutputSuccess({ exitCode }) {
        return exitCode === core.ExitCode.Success;
    }
    static sanitizeInput(input) {
        if (!isString(input)) {
            throw new Error('Invalid input type');
        }
        if (DISALLOWED_PATTERNS.some((pattern) => pattern.test(input))) {
            throw new Error(`Security risk detected in input: ${input}`);
        }
        return input;
    }
    static async execCommand({ command, args = [] }) {
        if (!ALLOWED_COMMANDS.some((allowed) => allowed === command)) {
            throw new Error(`Unauthorized Git command: ${command}`);
        }
        const sanitizedArgs = args.map(this.sanitizeInput).join(' ');
        const gitCommand = ['git', command, sanitizedArgs].join(' ').trim();
        try {
            const { exitCode, stdout, stderr } = await exec.getExecOutput(gitCommand);
            core.info(`Git output: ${stdout}`);
            core.info(`Git errors: ${stderr}`);
            return { exitCode, stdout, stderr };
        }
        catch (error) {
            const message = isError(error) ? error.message : String(error);
            throw new Error(`Git command failed: ${message}`);
        }
    }
}
export const ensureQuoted = GitCommandExecutor.ensureQuoted;
export const execCommand = GitCommandExecutor.execCommand.bind(GitCommandExecutor);
export const isExecOutputSuccess = GitCommandExecutor.isExecOutputSuccess;
export const sanitizeInput = GitCommandExecutor.sanitizeInput;
//# sourceMappingURL=common.js.map