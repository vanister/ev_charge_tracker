---
name: evs-review
description: Review recent changes against repository rules, correctness, and integration contracts.
agent: evs-code-review
argument-hint: PR number, feature name, or review scope
---

Review the requested changes before sign-off.

Before reviewing, read and follow:
- [AGENTS.md](../../AGENTS.md)
- [architecture.md](../../architecture.md)

Checklist:
- Correctness and edge cases
- `Result<T>` and error-handling conventions
- Hook-based data access instead of direct database usage in components
- TypeScript conventions and type locality
- Component and helper conventions
- Shared architecture contract alignment
- Missing tests when behavior changed substantially

Output format:
- Findings first.
- Group by Must fix, Should fix, Consider.
- If the change set is larger than about 100 lines, use the `evs-code-review` custom agent to keep the review cold.
- If the scope is large, keep the review cold and skeptical.
- If no findings remain, say so clearly.
