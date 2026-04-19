---
name: evs-orchestrate
description: Run a plan, implement, review workflow for a feature with an explicit approval pause before coding.
agent: agent
argument-hint: feature name or design doc path
---

Run the repository's plan -> implement -> review workflow.

Before starting, read and follow:
- [AGENTS.md](../../AGENTS.md)
- [architecture.md](../../architecture.md)

Workflow:
1. Identify the feature design doc and matching task doc under `docs/`.
2. Use the `evs-architect` custom agent to produce an implementation plan and save it to `.claude/plans/<feature-name>.md`.
3. Summarize the plan for the user.
4. Pause and ask the user to approve the plan before any code is written.
5. After approval, use the `evs-coder` custom agent to implement the plan.
6. After implementation, use the `evs-code-review` custom agent for a cold review with no shared implementation context beyond the changed code, the design doc, [AGENTS.md](../../AGENTS.md), and [architecture.md](../../architecture.md).
7. Report the outcome and any unresolved findings.

Rules:
- Do not skip the approval pause between planning and coding.
- Run one pipeline at a time.
- If the architect flags shared-surface changes, surface that request to the user before proceeding.
- Do not commit.
