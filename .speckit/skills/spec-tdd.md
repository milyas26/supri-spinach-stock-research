<!-- speckit:managed -->
# spec-tdd

## Goal

Run a ready story through red-green-refactor with evidence and checkpoints.

## Phase

run

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- ready story
- current context
- evidence file

## Outputs

- code changes
- tests
- TDD evidence
- session checkpoint

## Practices

- Require ready-for-dev status and current context before code edits.
- Write or run the smallest failing test before implementation.
- Record red, green, and refactor evidence with session checkpoints.

## Common Mistakes To Prevent

- Writing implementation before RED evidence.
- Marking a task done without a passing command.

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
