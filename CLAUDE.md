# EV Charge Tracker

Vite + TypeScript + React 19 PWA for tracking EV charging sessions.
Mobile-focused, fully offline with IndexedDB via Dexie.js. Deployed to Cloudflare via Wrangler.

## Docs
- [Design outline](./docs/design-outline.md)
- [Technical architecture](./docs/technical-design.md)
- [Outstanding tasks](./docs/tasks.md)

## Stack
- React 19, TypeScript, Vite, Tailwind CSS, clsx
- Dexie.js (IndexedDB), date-fns, Cloudflare/Wrangler

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
- Keep types close to where they're used in the feature; move to [shared-types](./src/types/shared-types.ts) only if used across features
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

### General
- Dates handled with `date-fns`
- App-level constants in `src/constants.ts`
- `React.FormEvent` is deprecated — use `React.SubmitEvent<T>` for form submit handlers
- Run `npm run build` after major changes to verify no build errors

## Key Conventions
- Use `/refactor` to clean up code to project standards
- Use `/review` before considering anything done
- Use `/component` to scaffold a React component

## Task Rules
- Complete one task at a time before asking for next (unless told otherwise)
- Mark completed tasks in the relevant task list file
