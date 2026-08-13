# Quickstart Guide

Get started with the **Loop Engineering & Multi-Agent Swarm Skill** in under 5 minutes across popular AI coding agent runtimes.

---

## 1. Installation by Agent Runtime

### Claude Code
Install to your Claude Code personal skills directory:
```bash
mkdir -p ~/.claude/skills/loop-engineering
cp SKILL.md ~/.claude/skills/loop-engineering/
```

### Gemini CLI & Antigravity
Install to your Gemini CLI skills directory:
```bash
mkdir -p ~/.agents/skills/loop-engineering
cp SKILL.md ~/.agents/skills/loop-engineering/
```

### Codex / OpenAI Plugins
Install to your repository's local skills directory:
```bash
mkdir -p .agents/skills/loop-engineering
cp SKILL.md .agents/skills/loop-engineering/
```

### Cursor & OpenCode
Copy `SKILL.md` to your workspace root or `.cursor/rules/` / `.opencode/skills/`:
```bash
mkdir -p .opencode/skills/loop-engineering
cp SKILL.md .opencode/skills/loop-engineering/
```

---

## 2. Triggering the Skill

Once installed, invoke the skill when starting complex or multi-agent tasks:

```
Use loop-engineering to orchestrate an autonomous bug-fixer loop for the failing authentication test. Set a max budget of $2.00 and max 5 iterations.
```

---

## 3. Verification & Local Validation

Validate the skill format and schema locally:
```bash
bun install
bun run validate
```
Expected output:
```
🔍 Validating Loop Engineering Skill...
✅ Name: loop-engineering
✅ Description: Use when designing, orchestrating, or executing autonomous multi-agent coding loops with financial budget caps, minimal fixes, and continuous dev-QA gates.
✨ Skill validation passed successfully!
```
