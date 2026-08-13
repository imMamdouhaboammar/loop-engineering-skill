# Loop Engineering Primitives Reference

## 1. `minimal-fix`
The `minimal-fix` primitive dictates that code changes must be tightly scoped to fixing the specific target bug or feature requirement.

### Rules:
- No style or formatting refactoring on unrelated code lines.
- No renaming of unreferenced variables or functions outside the diff context.
- Keep diff sizes to under 50 lines whenever possible.

## 2. `loop-verifier`
The `loop-verifier` primitive separates code generation from verification.

### Rules:
- The agent that wrote the code MUST NOT be the only agent verifying it.
- Verification requires deterministic evidence: passing test outputs, clean terminal exit codes, or visual proof screenshots.

## 3. `loop-budget`
The `loop-budget` primitive enforces resource limits.

### Rules:
- Hard token cost cap: $2.00 USD.
- Hard iteration loop cap: 5 iterations.
- If limits are reached, the loop halts and sets state to `ESCALATED_HUMAN_REVIEW`.
