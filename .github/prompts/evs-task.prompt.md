---
name: evs-task
description: Implement one task from a task list, including verification and review.
agent: evs-coder
argument-hint: task list path and task to implement
---

Implement one task from a task list.

Before writing code, read and follow:
- [AGENTS.md](../../AGENTS.md)
- [architecture.md](../../architecture.md)

Task selection rules:
- Use the task list and specific task from the user prompt when provided.
- If no task list was specified, inspect `docs/` for available task list files and ask the user which one to use.
- If a task list is known but no task was chosen, list the outstanding tasks and ask the user which one to implement.
- Only implement one task at a time unless the user explicitly asks for more.

Before coding:
1. State which task list and task you are implementing.
2. Identify the files likely to change.
3. Outline the approach in a few sentences.
4. Flag ambiguities or dependencies before starting.

While implementing:
- Stay inside the selected task scope.
- Use existing project patterns.
- Run `npm run build` after major changes.

When complete:
- Run the `evs-review` prompt on the changed code before considering the task complete.
- Summarize what changed and why.
- Mark the task complete in the task list if the task list is in the workspace and the task is fully done.
- Flag any follow-up work that should become a new task.
