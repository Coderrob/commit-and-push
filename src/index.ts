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

import { Action } from './action';
import { getInputValue } from './inputs';
import { Input } from './types';

(async () => {
  const inputs = {
    [Input.AUTHOR_EMAIL]: getInputValue[Input.AUTHOR_EMAIL],
    [Input.AUTHOR_NAME]: getInputValue[Input.AUTHOR_NAME],
    [Input.BRANCH]: getInputValue[Input.BRANCH],
    [Input.COMMIT_MESSAGE]: getInputValue[Input.COMMIT_MESSAGE],
    [Input.CREATE_BRANCH]: getInputValue[Input.CREATE_BRANCH],
    [Input.DIRECTORY_PATH]: getInputValue[Input.DIRECTORY_PATH],
    [Input.FETCH_LATEST]: getInputValue[Input.FETCH_LATEST],
    [Input.FORCE_PUSH]: getInputValue[Input.FORCE_PUSH],
    [Input.GITHUB_HOSTNAME]: getInputValue[Input.GITHUB_HOSTNAME],
    [Input.GITHUB_TOKEN]: getInputValue[Input.GITHUB_TOKEN],
    [Input.OPEN_PULL_REQUEST]: getInputValue[Input.OPEN_PULL_REQUEST],
    [Input.PULL_REQUEST_BODY]: getInputValue[Input.PULL_REQUEST_BODY],
    [Input.PULL_REQUEST_TITLE]: getInputValue[Input.PULL_REQUEST_TITLE],
    [Input.REMOTE_REF]: getInputValue[Input.REMOTE_REF],
    [Input.REPOSITORY]: getInputValue[Input.REPOSITORY],
    [Input.SIGN_COMMIT]: getInputValue[Input.SIGN_COMMIT]
  };
  await new Action(inputs).execute();
})();
