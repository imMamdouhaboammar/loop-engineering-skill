# Loop Engineering Execution Examples

Real-world scenarios demonstrating how Loop Engineering manages autonomous agent workflows.

---

## Example 1: Autonomous Bug Reproduction & Fix Loop

### Problem Scenario
An API endpoint `/users/profile` returns `500 Internal Server Error` when optional fields are null.

### Execution Log (`loop-run-log.md`)
```markdown
[14:00:00] Orchestrator initialized loop (Pattern: swarm-auto-bugfixer, Budget: $2.00 max).
[14:00:15] bug-reproducer created test/reproduce_null_profile.test.ts. Test execution: FAIL (500 expected 200).
[14:00:45] minimal-fixer applied patch to src/controllers/userController.ts (+3 lines, -1 line).
[14:01:10] verifier-gate ran `bun test`. All 42 tests PASSED. Zero regressions.
[14:01:20] budget-sentinel logged total cost: $0.14. Orchestrator finalized state: RESOLVED.
```

---

## Example 2: Continuous Dev-QA Task Loop

### Execution Strategy
1. Developer agent implements Task 1.
2. EvidenceQA agent runs automated test suite and captures visual evidence.
3. If QA passes -> Advance to Task 2.
4. If QA fails -> Loop back to Developer with specific error trace (Max 3 attempts per task).
