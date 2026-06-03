<!-- speckit:managed -->
# spec-review

## Goal

Review acceptance coverage, TDD evidence, safety, docs, and session freshness.

## Phase

review

## Required Context

- `.speckit/memory/project-context.md`
- `.speckit/sessions/active.md`
- `.speckit/context/current.md` when story-scoped
- `.speckit/context/subagent-handoff.md` when delegating

## Inputs

- diff
- story
- evidence
- session log

## Outputs

- findings
- approval state
- follow-up tasks

## Practices

- Review spec compliance before code quality opinions.
- Prioritize correctness, security, regressions, and missing tests.
- Block closure when evidence, context, or session state is stale.

## Common Mistakes To Prevent

- Reviewing style before correctness.
- Accepting missing tests because the implementation looks simple.

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
