## Stack
- React 19, TypeScript, Vite, Tailwind CSS, clsx
- Dexie.js (IndexedDB), date-fns, Cloudflare/Wrangler

## Project Structure
- `src/` — application source code
- `tests/` — Vitest unit tests (mirrors `src/` structure)

## Universal Rules
- Guard clauses, early returns, avoid deep nesting
- `if` statements must have bodies
- Comment the *why* not the *how*
- No JSDocs or XML comments unless explicitly asked
- Simple, concise, single-purpose code
- KISS and DRY principles
- Return `Result<T>` instead of throwing exceptions

## Project Rules

### TypeScript
- `type` for typing, `interface` for true interfaces
- No primitive constructors: use `+value`, `!!value`, `` `${value}` ``
- Avoid explicit `!== null` or `!== undefined` — use `!!value` for non-falsy checks
- Keep types close to where they're used in the feature; move to [shared-types](./src/types/shared-types.ts) only if used across features
- Feature-specific types go in `<feature>-types.ts` files next to the feature
- No implicit `any`
- Components never import `db` directly — all data access through hooks that leverage the `useDatabase` hook

### Components
- Signature: `export function Component(props: ComponentProps) {...}`
- Props type defined in the same file
- Arrow functions for event handlers, callbacks, and internal functions
- Single component per file, single responsibility
- No business logic in components — keep it in hooks/helpers
- `clsx` for conditional class names
- Named exports only — no default exports
- No index barrel files

### Helpers & Utilities
- Named function declarations (not arrow functions) for standalone helpers/utilities
- Single responsibility
- `Result<T>` returned for fallible operations from the [shared-types](./src/types/shared-types.ts)

### Formatting
- Follow formatting rules in [.prettierrc](./.prettierrc)
- Import order: CSS → external deps → internal deps

### Data Conventions
- Dates stored as epoch ms (`number`), displayed via `dateUtils.ts` wrappers — never use `date-fns` directly
- Cost stored as `costCents` (integer), displayed with `formatCost()`

### General
- App-level constants in `src/constants.ts`
- `React.FormEvent` is deprecated — use `React.SubmitEvent<T>` for form submit handlers
- `usePageConfig(title)` at the top of every page component
- `useImmerState` for form state management
- `FormFooter` for form action buttons
- Toasts via `useToast().showToast()` for mutation feedback
- Detail pages handle both create and edit — `:id` param presence determines mode
- Run `npm run build` after major changes to verify no build errors

## Key Conventions
- **ALWAYS run `evs-review` after every code change before considering it complete — no exceptions**
- Use `evs-component` to scaffold a React component

## Task Rules
- Complete one task at a time before asking for next (unless told otherwise)
- Mark completed tasks in the relevant task list file
