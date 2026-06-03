<!-- speckit:managed -->
# spec-plan

## Goal

Create PRD, architecture, story, and evidence skeletons.

## Phase

plan

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- spec brief
- project memory

## Outputs

- PRD
- architecture notes
- story skeletons
- risk list

## Practices

- Check unfinished plans before creating new work.
- Write phases with files, dependencies, success criteria, and rollback.
- Keep plan state durable so sessions can rehydrate tasks later.

## Common Mistakes To Prevent

- Planning implementation before requirements are testable.
- Omitting rollback, dependency, or test strategy.

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
