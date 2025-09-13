import { NoChangesError } from '../errors';
export class Guards {
    static isString(value) {
        return typeof value === 'string';
    }
    static isError(error) {
        return error instanceof Error;
    }
    static isBoolean(value) {
        return typeof value === 'boolean';
    }
    static isTrue(value) {
        const trueBool = Guards.isBoolean(value) && value === true;
        const trueStr = Guards.isString(value) && value.toLowerCase() === 'true';
        return trueBool || trueStr;
    }
    static isNoChangesError(error) {
        return error instanceof NoChangesError;
    }
}
export const isString = Guards.isString;
export const isError = Guards.isError;
export const isTrue = Guards.isTrue;
//# sourceMappingURL=guards.js.map