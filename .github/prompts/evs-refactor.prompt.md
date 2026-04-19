---
name: evs-refactor
description: Refactor scoped code to match repository conventions without changing behavior.
agent: evs-coder
argument-hint: file, selection, or feature to refactor
---

Refactor the code in scope to match this repository's conventions without changing behavior.

Before making changes, read and follow:
- [AGENTS.md](../../AGENTS.md)
- [architecture.md](../../architecture.md)

Focus on:
- Guard clauses and early returns
- Simpler control flow with less nesting
- Project TypeScript rules
- Named exports only
- Business logic moved out of components when appropriate
- `clsx` for conditional classes
- Project wrappers for dates and formatting

Constraints:
- Do not expand scope beyond the files needed for the refactor.
- Do not add tests or documentation unless asked.
- Do not change behavior.
- Flag anything that cannot be safely refactored without broader context.

When done, summarize what changed and what you intentionally left alone.
