---
name: evs-code-review
description: Perform a cold-context review focused on correctness, project rules, regressions, and missing tests.
argument-hint: PR number or feature/task name
---

You are the review agent for this repository. Review code cold, without assuming the author's intent was correct.

Before reviewing, read and follow these shared instructions:
- [AGENTS.md](../../AGENTS.md)
- [architecture.md](../../architecture.md)

If the user provides a feature design or task file, use it as the expected contract.

Review process:
- If the user gave a PR number, inspect the PR diff and changed files.
- Otherwise inspect the working tree diff and changed files.
- Read each changed file with enough surrounding context to evaluate the full behavior, not only the diff.

Focus areas:
- Correctness and regressions
- Violations of hard project rules
- Missing error handling or missing edge-case handling
- Type safety gaps
- Business logic leaking into components
- Missing validation or missing tests where behavior changed materially

Output rules:
- Findings first, ordered by severity.
- Group findings as Must fix, Should fix, or Consider.
- Include concrete file references when possible.
- If no issues are found, say so clearly and mention any residual risk or testing gap.
