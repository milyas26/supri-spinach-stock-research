<!-- speckit:managed -->
# spec-context

## Goal

Build the smallest useful story context and subagent handoff.

## Phase

context

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- story
- evidence
- active session

## Outputs

- current context
- subagent handoff

## Practices

- Read project memory, active session, story, evidence, and relevant files.
- List files to read and files to modify separately.
- Avoid passing full chat history to implementation agents.

## Common Mistakes To Prevent

- Passing full chat history instead of curated files.
- Leaving out file ownership or stop conditions.

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
