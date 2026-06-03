<!-- speckit:managed -->
# spec-session

## Goal

Manage checkpoint, compaction, resume, and artifact-log discipline.

## Phase

session

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- active session
- artifact log

## Outputs

- checkpoint
- compact summary
- resume notes

## Practices

- Checkpoint after red, green, refactor, review, and scope changes.
- Compact noisy context into durable summaries before handoff.
- Sync runtime task progress back to plan and story files.

## Common Mistakes To Prevent

- Keeping durable decisions only in chat.
- Compacting after context is already unreliable.

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
