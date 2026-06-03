<!-- speckit:managed -->
# spec-ship

## Goal

Prepare clean release handoff after tests and review pass.

## Phase

ship

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- passing tests
- review result
- clean diff

## Outputs

- release notes
- commit plan
- handoff

## Practices

- Check git diff for unrelated changes and secrets before commit.
- Use focused conventional commits and release notes.
- Do not ship while tests, review, or evidence gates are failing.

## Common Mistakes To Prevent

- Shipping with unrelated changes in the diff.
- Publishing without checking secrets and package contents.

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
