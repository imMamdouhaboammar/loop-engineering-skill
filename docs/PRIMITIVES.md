# Loop Engineering Primitives

Loop Engineering relies on four core primitives to guarantee deterministic agent execution.

---

## 1. `minimal-fix`

The `minimal-fix` primitive prevents AI coding agents from bloating diffs with unrequested refactoring or reformatting.

### Core Invariants:
- Modify only files directly responsible for the target defect.
- Maintain existing codebase conventions and formatting style.
- Prefer a 3-line targeted patch over a 50-line structural rewrite.

---

## 2. `loop-verifier`

The `loop-verifier` primitive enforces strict Maker/Checker separation.

### Core Invariants:
- The agent that writes the implementation patch MUST NOT be the sole evaluator of its correctness.
- Verification requires explicit empirical evidence (terminal test runner logs, build exit codes, or screenshot artifacts).

---

## 3. `loop-budget`

The `loop-budget` primitive prevents runaway API costs during autonomous agent execution loops.

### Core Invariants:
- Set explicit max cost per execution session (Default: `$2.00` USD).
- Track cumulative prompt and completion tokens across all subagent dispatches.

---

## 4. `loop-constraints`

The `loop-constraints` primitive prevents infinite loops and agent stalls.

### Core Invariants:
- Max Iteration Cap: 5 loops per task.
- Stall Detection: If 2 consecutive iterations pass without reducing failing test counts, trigger emergency halt and escalate to human review.
