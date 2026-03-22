---
name: code-review
description: Reviews code for correctness, style, and project conventions. Use after implementing any feature or fix, or when asked to review recent changes.
tools: Read, Glob, Grep, Bash
model: sonnet
---

Review the code in context against these project standards before signing off.

## Checklist

### Correctness
- Logic is correct and handles edge cases
- No unhandled promise rejections or missing error states
- `Result<T>` is returned instead of throwing exceptions
- Data from Dexie is accessed only via hooks, never directly in components

### TypeScript
- `type` not `interface`
- No primitive constructors: `+value`, `!!value`, `` `${value}` `` preferred
- Types are defined close to where they're used
- No implicit `any`

### Components
- Named export only, no default export
- Props type defined in the same file
- Arrow functions used for handlers and callbacks
- No business logic in the component body — moved to helpers or hooks
- `clsx` used for any conditional class names
- No barrel files or re-exports

### Helpers
- Named function declarations, not arrow functions
- Single responsibility
- `Result<T>` returned for fallible operations

### General
- No JSDocs or XML comments
- Comments explain why, not what
- No unused variables, imports, or dead code
- Import order: external deps → project deps
- Guard clauses and early returns, no deep nesting

## Output

List any issues found, grouped by severity:
- **Must fix**: breaks correctness, violates a hard rule
- **Should fix**: style or convention gap
- **Consider**: minor improvement worth noting

If nothing is wrong, say so clearly.
