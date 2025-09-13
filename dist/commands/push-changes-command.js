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
 */
import * as core from '@actions/core';
/**
 * Command to push changes to a remote repository.
 */
export class PushChangesCommand {
    git;
    remoteRef;
    branch;
    forcePush;
    constructor(git, remoteRef, branch, forcePush) {
        this.git = git;
        this.remoteRef = remoteRef;
        this.branch = branch;
        this.forcePush = forcePush;
    }
    /**
     * Executes the command to push changes.
     */
    async execute() {
        core.info('Pushing changes...');
        await this.git.pushChanges(this.remoteRef, this.branch, this.forcePush);
    }
}
//# sourceMappingURL=push-changes-command.js.map