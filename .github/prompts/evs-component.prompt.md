---
name: evs-component
description: Scaffold a React component that follows this repository's conventions.
agent: evs-coder
argument-hint: component description, path, and props
---

Create a new React component from the user request.

Before writing code, read and follow:
- [AGENTS.md](../../AGENTS.md)
- [architecture.md](../../architecture.md)

Required workflow:
1. State the component name, target file path, and props shape before writing code.
2. Identify any helper or hook that should exist alongside the component.
3. If the component needs database-backed data, confirm the hook-based integration pattern instead of importing the database directly.

Required conventions:
- One component per file.
- Named export only, no default export.
- Props type lives in the same file.
- Arrow functions for handlers, callbacks, and internal functions.
- Keep business logic in hooks or helpers, not in the component body.
- Use `clsx` for conditional class names.
- Use Tailwind for styling.
- Do not add tests unless the user asked.
- Do not add comments unless they explain why.

Expected output:
- Implement the component in the appropriate `src/` feature folder.
- Keep the file name aligned to the component name.
- Match the repository's import order and formatting.
