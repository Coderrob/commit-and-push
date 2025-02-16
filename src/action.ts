import core from '@actions/core';
import { isError } from './utils/guards.js';
import { execCommand } from './utils/git.js';
import { Command } from './types.js';

export async function run({
  authorEmail,
  authorName,
  branch,
  commitMessage,
  directoryPath,
  forcePush,
  remoteRef,
  signCommit
}: {
  authorEmail: string;
  authorName: string;
  branch: string;
  commitMessage: string;
  directoryPath: string;
  forcePush: boolean;
  remoteRef: string;
  signCommit: boolean;
}) {
  try {
    // Set Git user identity
    await execCommand({
      command: Command.CONFIG,
      args: ['--global', 'user.name', authorName]
    });
    await execCommand({
      command: Command.CONFIG,
      args: ['--global', 'user.email', authorEmail]
    });

    // Enable GPG signing if requested
    if (signCommit) {
      await execCommand({
        command: Command.CONFIG,
        args: ['--global', 'commit.gpgsign', 'true']
      });
    }

    // Ensure branch exists
    await execCommand({ command: Command.FETCH, args: ['--all'] });
    await execCommand({ command: Command.CHECKOUT, args: [branch] });

    // Stage changes
    await execCommand({ command: Command.ADD, args: [directoryPath] });

    // Commit changes
    try {
      await execCommand({
        command: Command.COMMIT,
        args: signCommit ? ['-S', '-m', commitMessage] : ['-m', commitMessage]
      });
    } catch {
      core.info('No changes detected. Skipping commit.');
      process.exit(0);
    }

    // Push changes
    await execCommand({
      command: Command.PUSH,
      args: forcePush
        ? ['--force', remoteRef, `HEAD:${branch}`]
        : [remoteRef, `HEAD:${branch}`]
    });

    const commitHash = await execCommand({
      command: Command.REV_PARSE,
      args: ['HEAD']
    });

    core.setOutput('commit_hash', commitHash);

    core.info('Changes pushed successfully!');
  } catch (error) {
    const message = isError(error) ? error.message : String(error);
    core.setFailed(message);
  }
}
