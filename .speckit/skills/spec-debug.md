<!-- speckit:managed -->
# spec-debug

## Goal

Diagnose failures with evidence before changing code.

## Phase

debug

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- failure output
- recent changes
- impact scope

## Outputs

- root cause
- fix plan
- verification command

## Practices

- Capture exact failing output and pre-fix state.
- Trace root cause through callers, dependencies, and recent changes.
- Fix the cause, then verify against the original failure.

## Common Mistakes To Prevent

- Patching symptoms before reproducing the failure.
- Changing multiple variables at once.

## Hard Gates

- Verify required context before acting.
- Keep work scoped to this phase.
- Save durable progress to Speckit artifacts, not only chat.
- Use just-in-time file loading for long workflows.
- Halt when a required artifact is missing or stale.

## Stop Conditions

- Missing acceptance criteria.
- Missing or stale active session.
- Missing evidence path for code work.
- Blocked story or unresolved `NEEDS_CONTEXT` handoff.

## Output Contract

- State what was read.
- State what changed.
- State the next Speckit command.
- Write durable progress to the appropriate Speckit artifact.
- End delegated work with `DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`, or `NEEDS_CONTEXT`.

## Validation

- Run `speckit validate` when this skill changes workflow artifacts.
- Run focused tests when this skill changes code.
- Record command, result, and unresolved risks in the session checkpoint.
