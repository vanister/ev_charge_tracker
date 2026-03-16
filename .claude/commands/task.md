---
name: task
description: Implement a task from tasks.md. Use when picking up a new task or feature to implement.
---

Read docs/tasks.md and identify the next outstanding task, or implement the task I specify.

Before writing any code:
1. State which task you're implementing and why you chose it (if not specified)
2. Identify all files likely to be affected
3. Outline your approach in a few sentences
4. Flag any ambiguities or dependencies before starting

While implementing:
- Follow all rules in CLAUDE.md
- Single-responsibility components, logic in helpers/hooks not components
- Return `Result<T>` instead of throwing
- `Result<T>` is defined in `src/types/shared-types.ts` — use that, don't redefine it
- No default exports, no barrel files
- Run `npm run build` to verify no build errors after major changes

When done:
- Summarize what changed and why
- Flag anything left incomplete or any follow-up tasks worth adding to tasks.md