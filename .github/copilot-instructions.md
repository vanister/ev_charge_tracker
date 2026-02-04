# EV Charge Tracker - AI Coding Agent Instructions

**For project context and design rationale, see [design-outline.md](../docs/design-outline.md)**

## Universal Rules

- Guard clauses, early returns, avoid deep nesting
- No inline returns in `if` statements
- Comment the why not the how
- No documentation such as JSDocs or XML Comments unless explicitly asked to provide
- Simple, concise, single-purpose code
- print to 100 char line limit
- Follow SOLID principles
- Follow KISS principle
- Test-minded, but don't write tests unless asked to do so
- Leverage dependency injection and inversion of control when possible
- Keep exceptions truly exceptional, return results or error objects instead of throwing

## Project Rules

- 2-space indent, functional paradigm, pure functions (justify impure)
- Arrow functions for components, callbacks, and internal functions in hooks/components
- Named functions only for standalone helpers and utilities in separate utility files
- Arrow functions require parens, destructure objects
- Components: `export function Component(props: ComponentProps) {...}`
- Single-purpose components
- Keep logic in helpers/hooks not Components
- CSS Modules preferred
- Named exports only
- Use `type` for typing, `interface` for true interfaces
- Components should live in their own files
- No index barrel files
- Dates handled with date-fns
- Import ordering: CSS first → external deps → internal deps
- Run `npm run build` to verify no build errors after major changes

## Task-Specific Rules

- Only complete one task at a time before asking for next unless instructed otherwise
- WHen completing a, mark it done in [tasks.md](../docs/tasks.md)

**For task breakdown and implementation plan, see [tasks.md](../docs/tasks.md)**
