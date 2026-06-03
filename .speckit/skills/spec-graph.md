<!-- speckit:managed -->
# spec-graph

## Goal

Use sprint and graph robot outputs to choose safe, unblocked work.

## Phase

graph

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- sprint status
- synced stories

## Outputs

- next work recommendation
- graph sync notes

## Practices

- Run Beads Viewer through robot-safe commands only.
- Prefer unblocked, high-value stories with clear evidence paths.
- Mirror story state to graph artifacts before triage or next selection.

## Common Mistakes To Prevent

- Calling graph tooling without robot-safe output.
- Starting blocked work because it appears earlier in a list.

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
