<!-- speckit:managed -->
# Speckit TDD Run Workflow

## Required Context

- Project memory.
- Active session.
- Current context.
- Subagent handoff when delegating.
- Ready story with acceptance criteria.
- TDD evidence file.

## Execution

1. Read story and acceptance criteria.
2. Identify test targets and command.
3. Write or update failing tests first.
4. Record red evidence.
5. Implement minimal code.
6. Record green evidence.
7. Refactor and rerun tests.
8. Update story Dev Agent Record, File List, and Change Log.
9. Checkpoint the session.
10. Mark review-ready only after evidence is present.

## Stop Conditions

- Missing acceptance criteria.
- Missing evidence path.
- Missing active session.
- New dependency required without approval.
- Three failed implementation attempts on the same task.
