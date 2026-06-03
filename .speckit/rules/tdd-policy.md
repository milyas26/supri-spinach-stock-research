<!-- speckit:managed -->
# Speckit TDD Policy

Implementation stories use red-green-refactor by default.

Definition of Done:
- Acceptance criteria are explicit.
- Test intent is written before implementation.
- A failing test is observed or the existing regression test gap is recorded.
- Minimal code makes the test pass.
- Refactor keeps tests green.
- Evidence is recorded in the story or TDD evidence artifact.

Hard gates:
- Do not implement a code story without a ready story and evidence path.
- Do not mark RED complete until a failing test or explicit regression gap is recorded.
- Do not mark GREEN complete until the target test passes.
- Do not mark REFACTOR complete until the relevant regression command passes.
- Do not move a story to review without file list, change log, and AC evidence.
