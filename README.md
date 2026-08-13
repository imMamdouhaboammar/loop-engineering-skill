# 🔄 Loop Engineering & Multi-Agent Swarm Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![agentskills.io](https://img.shields.io/badge/agentskills.io-compatible-3ee8c5)](https://agentskills.io)

An production-grade **AI Agent Skill** for **Loop Engineering & Multi-Agent Swarm Orchestration**. Replaces unguided human prompting with design systems that orchestrate agents with budget caps, minimal fixes, and continuous Dev-QA gates.

---

## 🌟 Highlights

- **🎯 Maker/Checker Separation:** `minimal-fixer` and `verifier-gate` agents operate with zero shared bias.
- **💰 Financial Sentinel:** Hard budget limits ($2.00 max per run, 5 iterations max) prevent runaway token spend.
- **🧪 Test-Driven Reproduction:** Requires deterministic failing tests before any code patch is written.
- **⚡ Multi-Runtime Support:** Compatible with Claude Code, Codex, Gemini CLI, Cursor, and OpenCode.

---

## 📁 Repository Structure

```
loop-engineering-skill/
├── SKILL.md                 # Core Skill Definition (agentskills.io standard)
├── README.md                # Documentation & Quickstart
├── LICENSE                  # MIT License
├── package.json             # NPM package & validation scripts
├── references/              # Detailed Architecture & Primitives Guides
│   ├── loop-primitives.md
│   └── swarm-orchestration.md
└── scripts/                 # Utility scripts
    └── validate-skill.mjs   # Automated skill schema & link validator
```

---

## 🚀 Installation & Usage

### 1. Claude Code
Copy or link the skill to your Claude Code skills directory:
```bash
mkdir -p ~/.claude/skills/loop-engineering
cp SKILL.md ~/.claude/skills/loop-engineering/
```

### 2. Gemini CLI & Antigravity
Copy to Gemini CLI / Agents skills directory:
```bash
mkdir -p ~/.agents/skills/loop-engineering
cp SKILL.md ~/.agents/skills/loop-engineering/
```

### 3. Codex / OpenAI Plugins
Include in project root `.agents/skills/` directory:
```bash
mkdir -p .agents/skills/loop-engineering
cp SKILL.md .agents/skills/loop-engineering/
```

---

## 🛠️ Validation & Testing

Run skill validation using `bun`:
```bash
bun install
bun run validate
```

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.
