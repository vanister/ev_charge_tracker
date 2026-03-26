---
name: orchestrate
description: Run the architect → coder → review pipeline for a feature. Optionally pass a feature name, or pick from available design docs.
---

## Feature Selection

If the user provided a feature name, look for its design doc in `docs/` (e.g. `docs/<feature>.md`, `docs/<feature>-design.md`).

If no feature name was provided, scan `docs/` for available design/task doc pairs and list them. Ask the user which feature to work on. Do not assume or default — always ask.

## Pipeline

Run these steps in order, pausing where indicated:

### Step 1 — Architect

Spawn the **architect** agent (`.claude/agents/architect.md`) with this prompt:

> Read the feature design doc at `<design-doc-path>` and its task list at `<task-doc-path>` (if one exists). Produce an implementation plan.

If the architect asks for permission to modify shared surface area, relay the question to the user and pass the answer back.

When the architect finishes, tell the user:
- The plan was written to `.claude/plans/<feature-name>.md`
- A brief summary of what the plan covers (new files, reused contracts, route changes)

**PAUSE here. Ask the user to review the plan and confirm before proceeding to the coder.** Do not continue until the user approves.

### Step 2 — Coder

After the user approves the plan, spawn the **coder** agent (`.claude/agents/coder.md`) with this prompt:

> Execute the implementation plan at `.claude/plans/<feature-name>.md`. Follow it literally.

If the coder asks a question, relay it to the user and pass the answer back.

When the coder finishes, report what was built and any issues the coder flagged.

### Step 3 — Review

Run `/review` on all code the coder changed.

Report the review results to the user:
- If the review passes, summarize the completed feature
- If the review has issues, list them and ask the user how to proceed (fix manually, re-run coder with specific fixes, or accept as-is)

## Rules

- Only run one pipeline at a time
- Do not skip steps or reorder them
- Do not commit code — leave that to the user
- If any step fails or the user wants to stop, halt the pipeline and summarize where things stand
