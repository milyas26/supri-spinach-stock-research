<!-- speckit:managed -->
# spec-docs

## Goal

Update durable docs, changelog, and lessons after behavior changes.

## Phase

docs

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- changed behavior
- review result

## Outputs

- docs update
- changelog entry
- memory update

## Practices

- Update roadmap and changelog when milestone or behavior changes.
- Record decisions and lessons in project memory when reusable.
- Keep docs aligned with actual implemented behavior.

## Common Mistakes To Prevent

- Documenting intended behavior instead of actual behavior.
- Leaving roadmap status stale after milestone work.

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
