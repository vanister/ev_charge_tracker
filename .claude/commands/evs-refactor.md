---
name: evs-refactor
description: Refactor code to follow project conventions. Use when cleaning up components, helpers, or utilities.
---

Refactor the code in context to follow these project rules:

## Code Style
- Guard clauses and early returns, avoid deep nesting
- No inline returns in `if` statements
- No JSDocs or XML comments unless explicitly requested
- Comment the why not the how
- KISS and DRY principles
- Return `Result<T>` objects instead of throwing exceptions

## TypeScript
- `type` not `interface`
- Named exports only, no default exports
- No primitive constructors: `+value` not `Number(value)`, `!!value` not `Boolean(value)`, `` `${value}` `` not `String(value)`
- Keep types close to where they're used

## Components
- `export function Component(props: ComponentProps) {...}`
- Arrow functions for event handlers, callbacks, and internal functions
- Named functions only for standalone helpers/utilities in separate files
- Arrow functions require parens, destructure objects
- Single component per file
- Move complex or business logic into helpers/hooks, not in components
- No index barrel files, no re-exports

## Cleanup
- Use `clsx` for dynamic class names
- Dates via `date-fns` in `dateUtils.ts`
- Import ordering: external deps → project deps
- No primitive constructors for coercion

Do not change behaviour. Do not add tests. Do not add documentation.
Flag anything that can't be refactored without broader context.