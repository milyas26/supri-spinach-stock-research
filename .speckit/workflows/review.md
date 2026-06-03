<!-- speckit:managed -->
# Speckit Review Workflow

Review order:
1. Diff scope.
2. Acceptance criteria coverage.
3. TDD evidence.
4. Security and data handling.
5. Maintainability.
6. Docs/changelog impact.

Review layers:
- Spec compliance: requested behavior, AC coverage, and no unrelated scope.
- Edge-case pathing: unhandled branches, boundaries, error paths, and state transitions.
- Production readiness: security, performance, compatibility, observability, and rollback.

Output:
- Findings first, ordered by severity.
- Each finding includes file path, impact, and concrete fix.
- Explicitly state when no blocking issue is found.
