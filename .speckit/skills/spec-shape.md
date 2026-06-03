<!-- speckit:managed -->
# spec-shape

## Goal

Turn a rough request into a bounded Agile spec before planning.

## Phase

shape

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- user intent
- project memory

## Outputs

- spec brief
- open questions

## Practices

- Clarify business goal, users, constraints, and non-goals.
- Split large ideas into independent stories with acceptance criteria.
- Challenge over-engineered scope before it reaches implementation.

## Common Mistakes To Prevent

- Treating a solution guess as a requirement.
- Creating one large story for multiple independent outcomes.

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
