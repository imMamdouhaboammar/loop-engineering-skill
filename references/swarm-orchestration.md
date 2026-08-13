# Swarm Multi-Agent Orchestration Reference

## Overview
Swarm orchestration divides complex engineering tasks among specialized subagents operating under a central Lead Orchestrator.

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
└──────────────┘       └──────────────┘       └──────────────┘
                                                       │
                                                       ▼
                                              ┌──────────────┐
                                              │budget-sentin.│
                                              └──────────────┘
```

## Agent Communication Protocols
1. **Context Isolation:** Subagents receive isolated task briefs and input files; they do not inherit bloated session history.
2. **Evidence Artifacts:** Subagents report results through structured report files (`task-N-report.md`).
3. **Stall Condition Detection:** If two consecutive iterations yield no progress in passing tests, the orchestrator triggers stall recovery or human escalation.
