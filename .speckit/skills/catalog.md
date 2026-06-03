<!-- speckit:managed -->
# Spec Skill Catalog

This catalog is intentionally smaller than a broad general-purpose skill set. Speckit keeps only the skills required for enterprise Agile, TDD, long sessions, graph-guided work, and release hygiene.

## Core Skills

| Skill | Inspired By | Use When | Required Inputs |
| --- | --- | --- | --- |
| spec-shape | brainstorm, scenario | Turning rough intent into a bounded spec | user intent, project memory |
| spec-research | research, docs-seeker | Validating external choices and current docs | scope, source criteria |
| spec-plan | plan, project-management | Creating PRD, architecture, stories, and evidence skeletons | spec brief, project memory |
| spec-context | scout, context-engineering | Building current story context and handoff | story, evidence, session state |
| spec-graph | kanban, plans-kanban, gkg | Choosing and sequencing safe work | synced stories, robot graph output |
| spec-session | context-engineering, watzup | Preserving long-running work | active session, artifact log |
| spec-tdd | implementation-runner, test | Implementing code with red-green-refactor | ready story, context, evidence |
| spec-test | test, web-testing | Selecting and running verification | changed files, acceptance criteria |
| spec-debug | debug, fix, sequential-thinking | Diagnosing failures before changing code | failing output, impact scope |
| spec-review | code-review, security-scan | Reviewing code and artifacts | diff, story, evidence, session log |
| spec-docs | docs, journal, retro | Updating docs and durable decisions | changed behavior, release notes |
| spec-ship | git, ship, deploy | Preparing clean release handoff | passing tests, review result |

## Selection Policy

- Pick the smallest skill that covers the current phase.
- Load skill detail only when that phase is active.
- Never mix planning and implementation in the same skill invocation.
- Prefer file handoff over chat handoff for subagents.
- Do not import broad domain skills unless the current story explicitly needs that domain.
- Use `spec-debug` before fixes when the root cause is not proven.
- Use `spec-test` after implementation and before review.

## Prompt Quality Policy

- Every skill starts with goal, phase, required context, hard gates, and output contract.
- Every implementation skill records durable evidence in story, session, and evidence artifacts.
- Long workflows use just-in-time context loading instead of loading future steps early.
- Human checkpoints are explicit: continue, clarify, or halt.
- Machine-readable evidence is preferred for validators and review automation.
