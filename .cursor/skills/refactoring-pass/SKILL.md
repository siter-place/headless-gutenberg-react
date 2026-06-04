---
name: refactoring-pass
description: Use this skill when refactoring existing code while preserving behavior.
---

# Refactoring Pass

This skill adds depth to the always-on rule `002-refactoring-discipline.mdc` and the on-demand rule `007-refactoring-pass.mdc`. Invoke it for dedicated refactoring passes, not for every code change.

When using this skill:

1. Identify current behavior.
2. Preserve public API and observable behavior.
3. Make small reversible changes.
4. Run tests after meaningful changes.
5. Do not mix refactoring with feature changes.
6. Avoid speculative abstractions.
7. Summarize what changed and what remained the same.

References (read when performing a deep refactoring):
- `.cursor/rules/external/ciembor/refactoring.mini.md` — Refactoring by Martin Fowler
- `.cursor/rules/external/ciembor/clean-architecture.mini.md` — architecture-level refactoring
