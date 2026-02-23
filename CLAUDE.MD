# EV Charge Tracker - Project Memory

## Critical: Follow .github/copilot-instructions.md

Always follow the rules in `.github/copilot-instructions.md` for this project.

### Universal Rules
- Guard clauses, early returns, avoid deep nesting
- No inline returns in `if` statements
- Comment the why not the how
- No JSDocs or XML Comments unless explicitly asked
- Simple, concise, single-purpose code
- 100 char line limit
- SOLID and KISS principles
- Test-minded, but don't write tests unless asked to do so
- Leverage dependency injection and inversion of control when possible
- No throwing exceptions — return results or error objects instead

### Project Rules
- Follow `.prettierrc` for formatting
- Arrow functions for components, callbacks, and internal hook/component functions
- Named functions only for standalone helpers/utilities in separate files
- Arrow functions require parens, destructure objects
- Component signature: `export function Component(props: ComponentProps) {...}`
- Single-purpose components; break down complex components but avoid over-abstraction
- Keep logic in hooks/helpers not components
- CSS Modules preferred
- Named exports only
- `type` for typing, `interface` for true interfaces
- Components in their own files; no index barrel files
- Dates handled with date-fns
- Import order: CSS → external deps → internal deps
- No primitive constructors: use `+value`, `!!value`, `` `${value}` ``
- Run `npm run build` after major changes to verify no build errors
- Use `React.SubmitEvent<T>` not `React.FormEvent` (deprecated)

### Task-Specific Rules
- Complete one task at a time before asking for next (unless told otherwise)
- Mark completed tasks in `docs/tasks.md`
