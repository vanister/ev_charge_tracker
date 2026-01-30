# EV Charge Tracker - AI Coding Agent Instructions

**For project context and design rationale, see [design-outline.md](../docs/design-outline.md)**

## Universal Rules

- Guard clauses, early returns, avoid deep nesting
- No inline returns in `if` statements
- Comment the why not the how
- No documentation such as JSDocs or XML Comments unless explicitly asked to provide
- Simple, concise, single-purpose code
- print to 100 char line limit
- Follow SOLID principles,
- Test-minded, but don't write tests unless asked to do so.

## Project Rules

- 2-space indent, functional paradigm, pure functions (justify impure)
- Named function declarations over arrows (unless clarity improves)
- Arrow functions require parens, destructure objects
- Components: `export function Component(props: ComponentProps) {...}`
- Single-purpose components
- Keep logic in helpers/hooks not Components
- CSS Modules preferred

## Task-Specific Rules

- Only complete one task at a time before asking for next unless instructed otherwise

**For task breakdown and implementation plan, see [tasks.md](../docs/tasks.md)**
