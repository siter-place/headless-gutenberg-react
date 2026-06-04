# Agent Rules and Skills Sources

This project uses a small curated set of local rules inspired by external repositories.

## Sources

### ciembor/agent-rules-books

Repository:
https://github.com/ciembor/agent-rules-books

Purpose:
Software-engineering rules inspired by Clean Code, Refactoring, Clean Architecture, DDD and related books.

Usage in this repo:
- clean-code guidance
- refactoring discipline
- clean architecture principles
- philosophy of software design principles

Installed files:
- `.cursor/rules/external/ciembor/clean-code.mini.md`
- `.cursor/rules/external/ciembor/refactoring.mini.md`
- `.cursor/rules/external/ciembor/clean-architecture.mini.md`
- `.cursor/rules/external/ciembor/philosophy-of-software-design.mini.md`

Policy:
Use `mini` or `nano` versions.
Do not use `full` versions as always-on Cursor rules.

### tech-leads-club/agent-skills

Repository:
https://github.com/tech-leads-club/agent-skills

Purpose:
Registry of reusable agent skills.

Usage in this repo:
- coding guidelines skill (Karpathy-inspired behavioral guidelines)
- React best practices reference index

Installed files:
- `.cursor/skills/coding-guidelines/SKILL.md` (installed as active skill)
- `.cursor/rules/external/tech-leads-club/react-best-practices.md` (reference index only, per-rule detail files not installed)

Removed files (previously installed, removed to reduce overlap):
- `coding-guidelines.md` — was an exact duplicate of the skill; removed
- `security-best-practices.md` — expected a `references/` subdirectory that was never installed; removed as dead reference

Policy:
Do not install the full registry.
Copy only reviewed skills that are directly useful.

### matank001/cursor-security-rules

Repository:
https://github.com/matank001/cursor-security-rules

Purpose:
Security-focused Cursor rules.

Usage in this repo:
- secure MCP usage
- Node.js-specific security rules
- dangerous flow identification

Installed files:
- `.cursor/rules/external/security/secure-mcp-usage.mdc`
- `.cursor/rules/external/security/secure-dev-node.mdc`
- `.cursor/rules/external/security/dangerous-flows.mdc`

Removed files (previously installed, merged or removed):
- `secure-development-principles.mdc` — merged into project rule `003-security-rules.mdc` to eliminate always-on overlap

Policy:
Security rules should be active and reviewed.
Do not blindly enable rules that block normal development without understanding them.

## Maintenance

When updating external rules:
1. Re-clone sources into `.tmp-agent-rules`.
2. Compare changes before copying.
3. Keep local rules small.
4. Keep project-specific rules more important than generic external rules.
5. Document what changed.
