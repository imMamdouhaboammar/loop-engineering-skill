# Run Invariant Contract

Loop Engineering treats a run as an ordered event log. The checker in `scripts/check-run.mjs` validates that the log cannot claim success after violating core loop boundaries.

## Event shape

```json
{
  "config": {
    "maxIterations": 5,
    "requireFailingReproduction": true
  },
  "events": [
    { "type": "reproduction", "result": "fail", "iteration": 0 },
    { "type": "mutation", "actor": "maker", "iteration": 1 },
    { "type": "verification", "actor": "checker", "result": "pass", "iteration": 1 },
    { "type": "completion", "iteration": 1 }
  ]
}
```

## Enforced invariants

1. No event may report an iteration above `maxIterations`.
2. When failing reproduction is required, no mutation may occur before a confirmed failing reproduction.
3. The actor that performs the latest mutation cannot independently approve that mutation as checker.
4. Completion requires a passing verification after the latest mutation.
5. A failed latest verification cannot become completion.
6. Three identical failure signatures using the same strategy require a strategy change instead of another blind retry.
7. No work may continue after `budget_exhausted`, `timeout`, or `halted`.

## CLI

```bash
node scripts/check-run.mjs path/to/run.json
```

Exit codes:

- `0`: invariant check passed
- `1`: run is syntactically readable but violates one or more invariants
- `2`: CLI usage or JSON parsing error

## Verification

```bash
npm test
npm run verify
```

The test suite uses deterministic event logs and includes adversarial false-completion, stale-verification, self-approval, retry-stall, timeout, and budget-exhaustion cases.

## Boundary

This checker is not a coding runtime or generic agent orchestrator. It only validates evidence emitted by an iterative engineering run. Host-specific execution remains the responsibility of the calling agent environment.
