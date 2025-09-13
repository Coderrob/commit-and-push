# Types file structure guide

This guide defines a standard ordering and content rules for files that only
contain types, enums, and interfaces (for example `src/types.ts` or any file
under `src/types/`). Adopting this style keeps code consistent and easy to scan.

## Required ordering

When a file contains only declarations (constants, enums, types, interfaces),
follow this section order exactly:

1. constants
2. enums
3. types
4. interfaces

Place each section in the file with a short comment header like:

/\* ==========================

- Constants
- ========================== \*/

## Examples

Example `src/types.ts` (minimal):

```ts
/* Constants */
export const DISALLOWED_PATTERNS = Object.freeze([/\.\./g]);

/* Enums */
export enum Input {
  BRANCH = 'branch'
}

/* Types */
export type InputEntry = IEntry<Input>;

/* Interfaces */
export interface IEntry<T> {
  id: T;
  default: string;
}
```

### Multi-file layout

You may also split large type declarations into multiple files under
`src/types/`:

- `src/types/constants.ts` — constants only
- `src/types/enums.ts` — enums only
- `src/types/index.ts` — re-export barrel

Barrel exports should be used so consumers import from `src/types` rather than
deep paths.

## Rules & rationale

- Keep pure-declaration files free of runtime logic (no function bodies that
  execute work at module import).

- Use `export` for all symbols that cross module boundaries. Prefer
  `Readonly<T[]>` for arrays exposed as constants.
- Avoid duplicating symbols across files. If you need the same symbol in
  multiple places, export it from a single types file and import it where
  needed.
- Use `enum` only when a clear set of named constants is required. Prefer `type`
  and `union` for lightweight discriminated unions.
- Keep imports to a minimum and only import other types if absolutely necessary
  to avoid circular type deps.

## Linting and CI

- The repository's lint/TS setup may enforce `tsconfig` and formatting rules.
  After editing types files, run:

```bash
npm run format && npx tsc --noEmit
```

or the project's `test` script to ensure no failures.

## Updating existing files

- When reordering an existing file, ensure there are no duplicate declarations
  and that imports elsewhere reference the same exported symbol names.

- If a file previously contained runtime code, consider moving runtime parts
  into a sibling runtime file (e.g., `src/vcs/common.ts`) and keeping
  `src/types.ts` purely declarative.

## Contact

If you want me to apply this ordering to other files in the repo (or to split
types into a `src/types/` folder), tell me which files and I will update them
consistently.
