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
 * Command to update Git configuration.
 */
export class UpdateConfigCommand {
    git;
    authorName;
    authorEmail;
    signCommit;
    constructor(git, authorName, authorEmail, signCommit) {
        this.git = git;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.signCommit = signCommit;
    }
    /**
     * Executes the command to update Git configuration.
     */
    async execute() {
        core.info('Updating config...');
        await this.git.updateConfig(this.authorName, this.authorEmail, this.signCommit);
    }
}
//# sourceMappingURL=update-config-command.js.map