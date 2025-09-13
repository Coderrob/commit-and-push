/* Single canonical type definitions for the project.
 * Order: constants -> enums -> types -> interfaces */
/* Constants (no enum deps) */
export const DISALLOWED_PATTERNS = Object.freeze([
    /\.\./g,
    /[\r\n]/g,
    /[;&|]/g,
    /`/g,
    /\$/g
]);
/* Enums */
export var GitCommand;
(function (GitCommand) {
    GitCommand["ADD"] = "add";
    GitCommand["BRANCH"] = "branch";
    GitCommand["CHECKOUT"] = "checkout";
    GitCommand["CLONE"] = "clone";
    GitCommand["CONFIG"] = "config";
    GitCommand["COMMIT"] = "commit";
    GitCommand["FETCH"] = "fetch";
    GitCommand["MERGE"] = "merge";
    GitCommand["PULL"] = "pull";
    GitCommand["PUSH"] = "push";
    GitCommand["RESET"] = "reset";
    GitCommand["REV_PARSE"] = "rev-parse";
    GitCommand["STATUS"] = "status";
    GitCommand["TAG"] = "tag";
})(GitCommand || (GitCommand = {}));
export var Input;
(function (Input) {
    Input["AUTHOR_EMAIL"] = "author-email";
    Input["AUTHOR_NAME"] = "author-name";
    Input["BRANCH"] = "branch";
    Input["COMMIT_MESSAGE"] = "commit-message";
    Input["CREATE_BRANCH"] = "create-branch";
    Input["DIRECTORY_PATH"] = "directory-path";
    Input["FETCH_LATEST"] = "fetch-latest";
    Input["FORCE_PUSH"] = "force-push";
    Input["GITHUB_HOSTNAME"] = "github-hostname";
    Input["GITHUB_TOKEN"] = "github-token";
    Input["OPEN_PULL_REQUEST"] = "open-pull-request";
    Input["REMOTE_REF"] = "remote-ref";
    Input["REPOSITORY"] = "repository";
    Input["SIGN_COMMIT"] = "sign-commit";
})(Input || (Input = {}));
export var Output;
(function (Output) {
    Output["COMMIT_HASH"] = "commit-hash";
})(Output || (Output = {}));
export var Quote;
(function (Quote) {
    Quote["SINGLE"] = "'";
    Quote["DOUBLE"] = "\"";
})(Quote || (Quote = {}));
/* Constants (enum-dependent) */
export const ALLOWED_COMMANDS = Object.freeze([
    GitCommand.ADD,
    GitCommand.BRANCH,
    GitCommand.CHECKOUT,
    GitCommand.CLONE,
    GitCommand.CONFIG,
    GitCommand.COMMIT,
    GitCommand.FETCH,
    GitCommand.MERGE,
    GitCommand.PULL,
    GitCommand.PUSH,
    GitCommand.RESET,
    GitCommand.REV_PARSE,
    GitCommand.STATUS,
    GitCommand.TAG
]);
/* End of file */
//# sourceMappingURL=types.js.map