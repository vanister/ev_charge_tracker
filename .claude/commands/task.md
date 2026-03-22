---
name: task
description: Implement a task from tasks.md. Use when picking up a new task or feature to implement.
---

## Task selection

Use the task list and specific task from the user's prompt if provided.

If no task list was specified, check `docs/` for available task list files (e.g. `tasks.md`, `sync-system-tasks.md`, `maintenance-tracking-tasks.md`) and ask the user which one to use, defaulting to `docs/tasks.md`.

If a task list was identified but no specific task was given, read the file, list the outstanding tasks, and ask the user which one to implement. If it is still unclear after asking, pick the next outstanding task and state why.

Before writing any code:
1. State which task list and task you're implementing
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