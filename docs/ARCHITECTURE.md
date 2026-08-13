# Architecture Guide

The **Loop Engineering & Multi-Agent Swarm** framework organizes AI coding agents into specialized roles connected by structured feedback loops, budget sentinels, and verification gates.

---

## Swarm Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    Swarm Orchestrator                       │
│     (Tracks Pipeline State, Max 5 Loop Iterations, $2.00 Cap)│
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│bug-reproducer│ ────► │minimal-fixer │ ────► │verifier-gate │
│(Synthesizes  │       │ (Targeted    │       │ (100% Pass,  │
│ Failing Test)│       │  Code Patch) │       │ Zero Regr.)  │
└──────────────┘       └──────────────┘       └──────┬───────┘
                                                     │
                                                     ▼
                                              ┌──────────────┐
                                              │budget-sentin.│
                                              │(Financial    │
                                              │ Sentinel)    │
                                              └──────────────┘
```

---

## Agent Responsibilities

### 1. Swarm Orchestrator
- **Role**: Main process coordinator.
- **State Management**: Writes and updates `STATE.md` and `loop-run-log.md`.
- **Termination Control**: Enforces maximum iteration caps (5 max) and halts on stall detection (2 non-progressing iterations).

### 2. `bug-reproducer`
- **Role**: Synthesizes a standalone, minimal failing test case before any fix is attempted.
- **Rule**: Must confirm the test fails deterministically before handing off to `minimal-fixer`.

### 3. `minimal-fixer`
- **Role**: Implements code patch using the `minimal-fix` primitive.
- **Rule**: Modifies only lines required to satisfy the failing test. Zero scope-creep or unnecessary refactoring.

### 4. `verifier-gate`
- **Role**: Independent checker agent that executes the full test suite.
- **Rule**: Validates 100% test pass with zero regressions.

### 5. `budget-sentinel`
- **Role**: Resource and cost sentinel.
- **Rule**: Tracks cumulative token expenditure and halts the swarm if cost reaches `$2.00` USD.
