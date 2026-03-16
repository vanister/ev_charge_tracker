# EV Charge Tracker - AI Coding Agent Instructions

A Vite + TypeScript + React 19 PWA for tracking EV charging sessions. Mobile-focused, fully offline with all data persisted in IndexedDB via Dexie.js. Deployed to Cloudflare via Wrangler.

**For project context and design rationale, see [design-outline.md](./docs/design-outline.md)**
**For full technical architecture, see [technical-design.md](./docs/technical-design.md)**
**For outstanding tasks, see [tasks.md](./docs/tasks.md)**

---

## Universal Rules

- Guard clauses, early returns, avoid deep nesting
- No inline returns in `if` statements
- Comment the why not the how, except for `// todo comments`
- No documentation such as JSDocs or XML Comments unless explicitly asked to provide
- Simple, concise, single-purpose code
- Single responsibility components, helpers and utilities
- Follow KISS principle
- Follow DRY principle
- Test-minded, but don't write tests unless asked to do so
- Leverage dependency injection and inversion of control when possible
- Keep exceptions truly exceptional, return `Result<T>` objects instead of throwing

---

## Project Rules

- Arrow functions for component event handlers, callbacks, and internal functions
- Named functions only for standalone helpers and utilities in separate files
- Arrow functions require parens, destructure objects
- Components: `export function Component(props: ComponentProps) {...}`
- Break down complex components into smaller ones, avoid over-abstraction
- Keep logic in helpers/hooks, not in Components
- Named exports only — no default exports
- Use `type` for typing (not `interface`)
- Single component per file
- Single-purpose components encapsulating Tailwind CSS
- No index barrel files
- No re-exports
- Dates handled with `date-fns` in `dateUtils.ts`
- Import ordering: external deps → project deps
- Keep types close to where they're used; move to a feature or shared location only if used outside of its originating Component, helper, or utility
- No primitive constructors for coercion: use `+value` not `Number(value)`, `!!value` not `Boolean(value)`, `` `${value}` `` not `String(value)`
- Run `npm run build` to verify no build errors after major changes
- `React.FormEvent` is marked deprecated — use `React.SubmitEvent<T>` for form submit handlers
- Use the `clsx` package for dynamic CSS class name creation
- Keep CONSTANTS that are not component specific in a root constants.ts file
